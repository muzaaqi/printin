"use client";
import React, { useEffect, useRef, useState, useCallback,DragEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { CheckoutSchema, checkoutSchema } from "@/lib/schema/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck } from "lucide-react";
import type { Service } from "./type";
import { X } from "lucide-react";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/png",
  "image/jpeg", // .jpg & .jpeg
];

interface CheckoutModalProps {
  service: Service;
  open: boolean;
  onClose: () => void;
}

const CheckoutPage = ({ service, open, onClose }: CheckoutModalProps) => {
  const [qris, setQris] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheets, setSheets] = useState<number | null>(null);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      notes: "",
    },
  });

  const resetAndClose = useCallback(() => {
    form.reset();
    setUploadedFile(null);
    setIsDragOver(false);
    setQris(false);
    setBasePrice(null);
    setTotalPrice(null);
    onClose();
  }, [form, onClose]);

  const onSubmit = async (data: CheckoutSchema) => {
    if (!uploadedFile) {
      form.setError("file", { message: "File wajib diunggah" });
      return;
    }
    const fd = new FormData();
    fd.append("serviceId", service.id);
    fd.append("color", data.color);
    fd.append("side", data.side);
    fd.append("pages", String(data.pages));
    fd.append("sheets", String(sheets));
    fd.append("neededAt", data.date ? new Date(data.date).toISOString() : "");
    fd.append("notes", data.notes || "");
    fd.append("paymentMethod", data.payment);
    fd.append("file", uploadedFile);
    if (data.payment === "Qris" && data.qris && data.qris.length > 0) {
      fd.append("receipt", data.qris[0]);
    }

    setIsSubmitting(true);

    const res = await fetch("/api/transactions", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) {
      console.error(json.error);
      return;
    }
    // sukses: reset
    form.reset();
    setUploadedFile(null);
    setIsSubmitting(false);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    const dt = new DataTransfer();
    dt.items.add(file);
    form.setValue("file", dt.files);
    form.clearErrors("file");
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (ACCEPTED_MIME_TYPES.includes(file.type)) {
        handleFileSelect(file);
      } else {
        form.setError("file", {
          message:
            "Format file tidak valid. Hanya PDF, DOC, DOCX, PNG, JPG, atau JPEG.",
        });
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Tambahkan helper format
  const formatIDR = (n: number | null) =>
    n == null ? "-" : `Rp ${n.toLocaleString("id-ID")}`;

  // Gunakan watch agar reaktif
  const color = form.watch("color");
  const side = form.watch("side");
  const pages = form.watch("pages");

  // Effect hitung harga
  useEffect(() => {
    if (!service.prices) {
      setBasePrice(null);
      setTotalPrice(null);
      return;
    }

    // Tentukan key harga
    let priceKey: keyof Service["prices"] | null = null;
    if (color === "Hitam-Putih" && side === "Satu-Sisi")
      priceKey = "priceSingleSide";
    else if (color === "Hitam-Putih" && side === "Dua-Sisi")
      priceKey = "priceDoubleSides";
    else if (color === "Berwarna" && side === "Satu-Sisi")
      priceKey = "priceColorSingleSide";
    else if (color === "Berwarna" && side === "Dua-Sisi")
      priceKey = "priceColorDoubleSides";

    if (!priceKey) {
      setBasePrice(null);
      setTotalPrice(null);
      return;
    }

    const unit = Number(service.prices?.[priceKey]) || 0;
    setBasePrice(unit);

    const pageCount =
      typeof pages === "number"
        ? pages
        : pages && !isNaN(Number(pages))
        ? Number(pages)
        : 0;

    if (pageCount > 0) {
      if (
        priceKey === "priceDoubleSides" ||
        priceKey === "priceColorDoubleSides"
      ) {
        // Bagi 2 dan bulatkan ke atas
        const pageDoubleSides = Math.ceil(pageCount / 2);
        const sheetCount = pageDoubleSides;
        setSheets(pageDoubleSides);
        setTotalPrice(unit * sheetCount);
      } else {
        setSheets(pageCount);
        setTotalPrice(unit * pageCount);
      }
    } else {
      setTotalPrice(null);
    }
  }, [color, side, pages, service.prices]);

  if (!open) return null;

  return (
    <div className="fixed w-full bg-foreground/20 dark:bg-background/0 inset-0 z-50 2xl:flex backdrop-blur-md mx-auto items-center justify-center overflow-auto">
      <div className="relative max-w-screen-xl mx-auto md:px-10 bg-popover xl:border py-10 xl:rounded-lg">
        <button className="absolute top-4 right-4 cursor-pointer text-muted-foreground hover:text-accent-foreground" onClick={resetAndClose}>
          <X className="" />
        </button>
        <div className="grid items-center justify-center">
          <h1 className="text-accent-foreground text-4xl font-bold">
            Checkout
          </h1>
          <h2 className="text-muted-foreground text-md mx-auto">
            {service.serviceName}
          </h2>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg mt-5 px-5 md:px-0 md:h-svh xl:h-auto"
        >
          <div className="mb-6 bg-popover rounded-md">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={`
            border-2 border-dashed rounded-lg p-8 mt-2 cursor-pointer transition-all duration-200
            ${
              isDragOver
                ? "border-accent-foreground bg-card-foreground/10"
                : "border hover:border-accent-foreground hover:bg-card-foreground/5"
            }
            ${
              form.formState.errors.file &&
              "border-destructive/70 bg-card-foreground/5"
            }
          `}
            >
              <div className="text-center">
                {uploadedFile ? (
                  <div className="space-y-2">
                    <div className="text-gray-700 dark:text-muted-foreground">
                      <FileCheck className="mx-auto h-12 w-12" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                        const dt = new DataTransfer();
                        form.setValue("file", dt.files);
                      }}
                      className="text-xs text-destructive hover:text-red-800 underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-gray-300 dark:text-muted-foreground">
                      <Upload className="mx-auto h-12 w-12" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className="text-accent-foreground cursor-pointer">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      {form.formState.errors.file ? (
                        <p className="text-destructive text-sm mt-1">
                          {form.formState.errors.file &&
                          typeof form.formState.errors.file.message === "string"
                            ? form.formState.errors.file.message
                            : null}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/80">
                          PDF, DOC, DOCX, PNG, JPG or JPEG
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              id="upload-file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileInputChange}
            />
          </div>
          <div className="mx-auto grid md:grid-cols-2 gap-5 md:gap-10">
            <div className="space-y-3">
              <div className="mx-auto items-center flex flex-col space-y-3">
                <div className="w-full grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label>Warna</Label>
                    <Controller
                      name="color"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Opsi Warna" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hitam-Putih">
                              Hitam Putih
                            </SelectItem>
                            <SelectItem value="Berwarna">Berwarna</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.color && (
                      <span className="text-destructive">
                        {form.formState.errors.color.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label>Sisi</Label>
                    <Controller
                      name="side"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Opsi Sisi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Satu-Sisi">Satu Sisi</SelectItem>
                            <SelectItem value="Dua-Sisi">Dua Sisi</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.side && (
                      <span className="text-destructive">
                        {form.formState.errors.side.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label>Jumlah Halaman</Label>
                    <Input
                      {...form.register("pages", { valueAsNumber: true })}
                      type="number"
                      id="page"
                      min={1}
                      max={service.remainingStock}
                      placeholder={`Tersisa ${service.remainingStock.toLocaleString()}`}
                    />
                    {form.formState.errors.pages && (
                      <span className="text-destructive">
                        {form.formState.errors.pages.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label>Tanggal dibutuhkan</Label>
                    <Input
                      type="datetime-local"
                      className="justify-center md:justify-between px-2 text-sm text-muted-foreground"
                      {...form.register("date")}
                    />
                    {form.formState.errors.date && (
                      <span className="text-destructive">
                        {form.formState.errors.date.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full">
                {/* <Label htmlFor="date" className="">
                  Tanggal
                </Label>
                <Calendar
                  {...form.register("date")}
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full rounded-lg border"
                /> */}
                <div className="space-y-3">
                  <Label htmlFor="notes">Catatan</Label>
                  <textarea
                    {...form.register("notes")}
                    name="notes"
                    id="notes"
                    className="dark:bg-input/20 border rounded-md w-full p-3 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    rows={4}
                  ></textarea>
                  {form.formState.errors.notes && (
                    <span className="text-destructive">
                      {form.formState.errors.notes.message}
                    </span>
                  )}
                </div>

                <div className={`${qris && "grid grid-cols-2 gap-5"} mt-3`}>
                  <div className="space-y-3">
                    <Label htmlFor="payment-methods">Metode Pembayaran</Label>
                    <Controller
                      name="payment"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value} // penting agar controlled
                          onValueChange={(value) => {
                            field.onChange(value);
                            setQris(value === "Qris");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Metode Pembayaran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Qris">Qris</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {qris && (
                    <div className="space-y-3">
                      <Label>Bukti Pembayaran</Label>
                      <Input
                        {...form.register("qris")}
                        className="block file:bg-muted file:rounded-md file:px-2 pl-2 file:hover:bg-accent-foreground/10"
                        placeholder="Bukti Pembayaran"
                        type="file"
                        accept="image/*"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative space-y-3">
              {qris ? (
                <div className="mx-auto flex items-center justify-center">
                  <Image
                    className="rounded-md border"
                    src={"/qris.jpg"}
                    alt="qris"
                    width={300}
                    height={300}
                  />
                </div>
              ) : (
                <div className="w-full h-[300px] overflow-auto text-accent-foreground/90 border border-destructive/30 bg-destructive/10 rounded-md py-3 px-4">
                  <h1 className="text-lg font-semibold justify-self-center">
                    Informasi Pembayaran
                  </h1>
                  <h2 className="font-semibold">Cash</h2>
                  <ul className="text-md list-disc pl-5">
                    <li>
                      Pembayaran cash dibayarkan ketika anda sudah menerima
                      dokumen.
                    </li>
                    <li>
                      Diusahakan membawa nominal yang sesuai dengan harga total.
                    </li>
                    <li>Menunjukkan bukti transaksi saat pembayaran.</li>
                  </ul>
                  <h2 className="font-semibold mt-1">Qris</h2>
                  <ul className="text-md list-disc pl-5">
                    <li>Pembayaran dilaklukan ketika pengisian form.</li>
                    <li>
                      Wajib mengunggah bukti transkasi di kolom yang sudah
                      disediakan.
                    </li>
                  </ul>
                </div>
              )}
              <div className="md:absolute md:bottom-1 w-full space-y-2">
                <div className="flex w-full justify-between border-b">
                  <h2>Harga perlembar: </h2>
                  <h2 className="font-semibold">{formatIDR(basePrice)}</h2>
                </div>
                <div className="flex justify-between">
                  <h2 className="text-md font-semibold">Harga Total: </h2>
                  <h2 className="font-bold">{formatIDR(totalPrice)}</h2>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant={"secondary"}
            onClick={resetAndClose}
            className="w-full my-5"
          >
            Cancel
          </Button>
          <Button disabled={service.remainingStock === 0} className="w-full">
            {isSubmitting
              ? "Sedang Diproses..."
              : service.remainingStock > 0
              ? "Pesan"
              : "Stok Habis"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
