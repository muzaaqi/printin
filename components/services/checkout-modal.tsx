"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  DragEvent,
  ChangeEvent,
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
import { Upload, FileCheck, Ban, CircleCheck } from "lucide-react";
import { X } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Service } from "@/features/get-all-services";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { formatIDR } from "@/features/format";
import { formatForDatabase, isFutureDateTime } from "@/utils/formatter/datetime";
import axios from "axios";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

interface CheckoutModalProps {
  service: Service;
  open: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ service, open, onClose }: CheckoutModalProps) => {
  const [qris, setQris] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);
  const [sheets, setSheets] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      notes: "",
      datePart: "",
      timePart: "10:30",
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

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    const data = new DataTransfer();
    data.items.add(file);
    form.setValue("file", data.files);
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

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: CheckoutSchema) => {
    if (!uploadedFile) {
      form.setError("file", { message: "File wajib diunggah" });
      return;
    }

    // Validate date/time if provided
    if (data.datePart && data.timePart) {
      if (!isFutureDateTime(data.datePart, data.timePart)) {
        form.setError("datePart", {
          message: "Tanggal/waktu tidak boleh masa lampau",
        });
        return;
      }
    }

    // Format date/time for database WITHOUT timezone conversion
    const { needed_date, needed_time } =
      data.datePart && data.timePart
        ? formatForDatabase(data.datePart, data.timePart)
        : { needed_date: null, needed_time: null };

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("serviceId", service.id);
      formData.append("paperId", service.paper_id);
      formData.append("pages", String(data.pages));
      formData.append("sheets", String(sheets));

      // Send date/time separately
      if (needed_date) formData.append("neededDate", needed_date);
      if (needed_time) formData.append("neededTime", needed_time);

      formData.append("notes", data.notes || "");
      formData.append("price", String(service.price || 0));
      formData.append("paymentMethod", data.payment);
      formData.append("file", uploadedFile);

      if (data.payment === "Qris" && data.qris && data.qris.length > 0) {
        formData.append("receipt", data.qris[0]);
      }

      const res = await axios.post("/api/transactions", formData, {
        timeout: 30000, // 30 second timeout
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.error) {
        console.error("API Error:", res.data.error);
        toast.error("Transaksi gagal: " + res.data.error);
        return;
      }

      resetAndClose();
      toast.success("Transaksi berhasil disimpan!");
    } catch (error) {
      console.error("Submit error:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        toast.error("Gagal menyimpan transaksi: " + message);
      } else {
        toast.error("Terjadi kesalahan saat menyimpan transaksi");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const pages = form.watch("pages");
  useEffect(() => {
    if (!service.price) {
      setTotalPrice(null);
      setSheets(null);
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
    <div className="bg-foreground/20 dark:bg-background/0 fixed inset-0 z-50 mx-auto w-full items-center justify-center overflow-auto backdrop-blur-md 2xl:flex">
      <div className="bg-popover relative mx-auto max-w-screen-xl py-10 md:px-10 xl:rounded-lg xl:border">
        <button
          type="button"
          disabled={isSubmitting}
          className="text-muted-foreground hover:text-accent-foreground absolute top-4 right-4 cursor-pointer"
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
          className="mt-5 rounded-lg px-5 md:h-svh md:px-0 xl:h-auto"
        >
          <div className="bg-popover mb-6 rounded-md">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={`mt-2 cursor-pointer rounded-lg border-2 border-dashed p-8 transition-all duration-200 ${
                isDragOver
                  ? "border-accent-foreground bg-card-foreground/10"
                  : "hover:border-accent-foreground hover:bg-card-foreground/5 border"
              } ${
                form.formState.errors.file &&
                "border-destructive/70 bg-card-foreground/5"
              } `}
            >
              <div className="text-center">
                {uploadedFile ? (
                  <div className="space-y-2">
                    <div className="dark:text-muted-foreground text-gray-700">
                      <FileCheck className="mx-auto h-12 w-12" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                      {uploadedFile.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
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
                      className="text-destructive text-xs underline hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="dark:text-muted-foreground text-gray-300">
                      <Upload className="mx-auto h-12 w-12" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        <span className="text-accent-foreground cursor-pointer">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      {form.formState.errors.file ? (
                        <p className="text-destructive mt-1 text-sm">
                          {form.formState.errors.file &&
                          typeof form.formState.errors.file.message === "string"
                            ? form.formState.errors.file.message
                            : null}
                        </p>
                      ) : (
                        <p className="text-muted-foreground/80 text-xs">
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
          <div className="mx-auto gap-5 md:grid lg:grid-cols-2 lg:gap-10">
            <div className="space-y-3">
              <div className="mx-auto flex flex-col items-center space-y-3">
                <div className="md:text-md grid w-full grid-cols-3 gap-5 text-sm">
                  <div className="w-full justify-start text-center">
                    <span className="font-semibold">Ukuran Kertas</span>{" "}
                    <p>{service.papers?.size}</p>
                  </div>
                  <div className="w-full justify-center border-x text-center">
                    <span className="font-semibold">Berwarna</span>{" "}
                    <p>
                      {service.color ? (
                        <CircleCheck
                          size={16}
                          className="text-complete-foreground inline"
                        />
                      ) : (
                        <Ban size={16} className="text-destructive inline" />
                      )}
                    </p>
                  </div>
                  <div className="w-full justify-end text-center">
                    <span className="font-semibold">Bolak Balik</span>{" "}
                    <p>
                      {service.duplex ? (
                        <CircleCheck
                          size={16}
                          className="text-complete-foreground inline"
                        />
                      ) : (
                        <Ban size={16} className="text-destructive inline" />
                      )}
                    </p>
                  </div>
                </div>

                <div className="w-full grid-cols-2 gap-5 space-y-3 border-t pt-3 md:grid">
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
                      <div className="flex w-full flex-col gap-3">
                        <Label htmlFor="date-picker" className="px-1">
                          Tanggal
                        </Label>
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="w-full justify-between font-normal"
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
                      <div className="flex w-full flex-col gap-3">
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
                <div className="space-y-3">
                  <Label htmlFor="notes">Catatan</Label>
                  <textarea
                    {...form.register("notes")}
                    name="notes"
                    id="notes"
                    className="dark:bg-input/20 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border p-3 focus-visible:ring-[3px]"
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
                        className="file:bg-muted file:hover:bg-accent-foreground/10 block pl-2 file:rounded-md file:px-2"
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
                <div className="text-accent-foreground/90 border-destructive/30 bg-destructive/10 w-full overflow-auto rounded-md border px-4 py-3 md:mb-20 lg:mb-0 lg:h-[300px]">
                  <h1 className="justify-self-center text-lg font-semibold">
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
                  <h2 className="mt-1 font-semibold">Qris</h2>
                  <ul className="text-md list-disc pl-5">
                    <li>Pembayaran dilaklukan ketika pengisian form.</li>
                    <li>
                      Wajib mengunggah bukti transkasi di kolom yang sudah
                      disediakan.
                    </li>
                  </ul>
                </div>
              )}
              <div className="w-full space-y-2 md:absolute md:bottom-1">
                <div className="flex w-full justify-between border-b pb-1">
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
                className="my-5 w-full"
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
            className={`{${service.papers?.sheets === 0 ? "cursor-not-allowed" : isSubmitting ? "cursor-wait" : ""} w-full`}
          >
            {isSubmitting ? (
              <Spinner message="Processing" />
            ) : service.papers?.sheets > 0 ? (
              "Pesan"
            ) : (
              "Stok Habis"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
