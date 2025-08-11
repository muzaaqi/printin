"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  DragEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { CheckoutSchema, checkoutSchema } from "@/lib/schema/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, Ban, Check } from "lucide-react";
import { X } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Service } from "@/features/get-all-services";
import { toast } from "sonner";

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
  const [dateOpen, setDateOpen] = React.useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);
  const [sheets, setSheets] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      notes: "",
      datePart: "",
      timePart: "10:30:00",
    },
  });

  const resetAndClose = useCallback(() => {
    form.reset();
    setUploadedFile(null);
    setIsDragOver(false);
    setQris(false);
    setTotalPrice(null);
    onClose();
  }, [form, onClose]);

  const onSubmit = async (data: CheckoutSchema) => {
    if (!uploadedFile) {
      form.setError("file", { message: "File wajib diunggah" });
      return;
    }

    const rawTime = (data.timePart || "").trim();
    const time = rawTime
      ? rawTime.length === 5
        ? `${rawTime}:00`
        : rawTime
      : "00:00:00";
    const isoNeededAt = data.datePart
      ? new Date(`${data.datePart}T${time}`).toISOString()
      : "";

    if (isoNeededAt && isNaN(new Date(isoNeededAt).getTime())) {
      form.setError("datePart", { message: "Tanggal/Waktu tidak valid" });
      return;
    }

    const fd = new FormData();
    fd.append("serviceId", service.id);
    fd.append("paperId", service.paper_id);
    fd.append("pages", String(data.pages));
    fd.append("sheets", String(sheets));
    fd.append("neededAt", isoNeededAt);
    fd.append("notes", data.notes || "");
    fd.append("price", String(service.price || 0));
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
      setIsSubmitting(false);
      form.reset();
      toast.error("Transaksi gagal");
      return;
    }
    // sukses: reset
    setIsSubmitting(false);
    resetAndClose();
    toast.success("Transaksi berhasil");
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
  const pages = form.watch("pages");

  // Effect hitung harga
  useEffect(() => {
    if (!service.price) {
      setTotalPrice(null);
      return;
    }

    const unit = Number(service.price) || 0;

    const pageCount =
      typeof pages === "number"
        ? pages
        : pages && !isNaN(Number(pages))
        ? Number(pages)
        : 0;

    if (pageCount > 0) {
      if (service.duplex) {
        const pageDuplex = Math.ceil(pageCount / 2);
        const sheetCount = pageDuplex;
        setSheets(pageDuplex);
        setTotalPrice(unit * sheetCount);
      } else {
        setSheets(pageCount);
        setTotalPrice(unit * pageCount);
      }
    } else {
      setTotalPrice(null);
    }

  }, [pages, service.price, service.duplex]);

  if (!open) return null;

  return (
    <div className="fixed w-full bg-foreground/20 dark:bg-background/0 inset-0 z-50 2xl:flex backdrop-blur-md mx-auto items-center justify-center overflow-auto">
      <div className="relative max-w-screen-xl mx-auto md:px-10 bg-popover xl:border py-10 xl:rounded-lg">
        <button
          type="button"
          disabled={isSubmitting}
          className="absolute top-4 right-4 cursor-pointer text-muted-foreground hover:text-accent-foreground"
          onClick={resetAndClose}
        >
          <X className="" />
        </button>
        <div className="grid items-center justify-center">
          <h1 className="text-accent-foreground text-4xl font-bold">
            Checkout
          </h1>
          <h2 className="text-muted-foreground text-md mx-auto">
            {service.name}
          </h2>
        </div>
        <form
          id="checkout-form"
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
          <div className="mx-auto md:grid lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="space-y-3">
              <div className="mx-auto items-center flex flex-col space-y-3">
                <div className="w-full grid grid-cols-3 gap-5 text-sm md:text-md">
                    <div className="w-full text-center justify-start">
                      <span className="font-semibold">Ukuran Kertas</span> <p>{service.papers?.size}</p>
                    </div>
                    <div className="w-full text-center justify-center border-x">
                      <span className="font-semibold">Berwarna</span> <p>{service.color ? <Check size={16} className="inline text-emerald-400" /> : <Ban size={16} className="inline text-destructive" />}</p>
                    </div>
                    <div className="w-full text-center justify-end">
                      <span className="font-semibold">Bolak Balik</span> <p>{service.duplex ? <Check size={16} className="inline text-emerald-400" /> : <Ban size={16} className="inline text-destructive" />}</p>
                    </div>
                </div>

                <div className="w-full space-y-3 md:grid grid-cols-2 gap-5 border-t pt-3">
                  <div className="space-y-3">
                    <Label>Jumlah Halaman</Label>
                    <Input
                      {...form.register("pages", { valueAsNumber: true })}
                      type="number"
                      id="pages"
                      min={1}
                      max={service.papers?.sheets}
                      placeholder={`Tersisa ${service.papers?.sheets.toLocaleString()}`}
                    />
                    {form.formState.errors.pages && (
                      <span className="text-destructive">
                        {form.formState.errors.pages.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="date-picker" className="px-1">
                          Tanggal
                        </Label>
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="justify-between font-normal w-full"
                            >
                              {form.watch("datePart") || "Pilih tanggal"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={calendarDate}
                              captionLayout="dropdown"
                              onSelect={(d) => {
                                setCalendarDate(d);
                                if (d) {
                                  const iso = d.toISOString(); // yyyy-mm-ddTHH:MM:SSZ
                                  const yyyyMmDd = iso.slice(0, 10);
                                  form.setValue("datePart", yyyyMmDd, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                }
                                setDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {form.formState.errors.datePart && (
                          <span className="text-destructive text-xs">
                            {form.formState.errors.datePart.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="time-picker" className="px-1">
                          Waktu
                        </Label>
                        <Input
                          {...form.register("timePart")}
                          type="time"
                          id="time-picker"
                          step="60"
                          defaultValue="10:30:00"
                          className="bg-background w-full appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        {form.formState.errors.timePart && (
                          <span className="text-destructive text-xs">
                            {form.formState.errors.timePart.message}
                          </span>
                        )}
                      </div>
                    </div>
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
                <div className="w-full lg:h-[300px] overflow-auto text-accent-foreground/90 border border-destructive/30 bg-destructive/10 rounded-md py-3 px-4 md:mb-20 lg:mb-0">
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
                <div className="flex w-full justify-between pb-1 border-b">
                  <h2>Harga perlembar: </h2>
                  <h2 className="font-semibold">{formatIDR(service.price)}</h2>
                </div>
                <div className="flex justify-between">
                  <h2 className="text-md font-semibold">Harga Total: </h2>
                  <h2 className="font-bold">{formatIDR(totalPrice)}</h2>
                </div>
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild className="w-full">
              <Button
                type="button"
                variant={"secondary"}
                className="w-full my-5"
                disabled={isSubmitting}
              >
                Kembali
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Semua data kamu masukkan akan terhapus dari form ini.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button type="button" onClick={resetAndClose}>
                    Kembali
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant={"default"}
            type="submit"
            disabled={service.papers?.sheets === 0 || isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? "Sedang Diproses..."
              : service.papers?.sheets > 0
              ? "Pesan"
              : "Stok Habis"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
