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
import { Upload, FileCheck, Ban, CircleCheck, Loader2 } from "lucide-react";
import { X } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { formatIDR } from "@/utils/formatter/currency";
import {
  formatForDatabase,
  isFutureDateTime,
} from "@/utils/formatter/datetime";
import axios from "axios";
import { Services } from "@/features/get-all-services-realtime";
import {
  Courier,
  GetAllCouriersRealtime,
} from "@/features/get-all-couriers-realtime";
import { GenerateQRIS } from "@/hooks/transactions/generate-qris";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

interface CheckoutModalProps {
  service: Services;
  open: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ service, open, onClose }: CheckoutModalProps) => {
  const [qris, setQris] = useState(false);
  const [qrImage, setQrImage] = useState<string | null | undefined>(null);
  const [qrisLoading, setQrisLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);
  const [sheets, setSheets] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [couriers, setCouriers] = useState([]);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      timePart: "10:30",
      payment: undefined,
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

  const handlePayment = async () => {
    setQris(true);
    if (!totalPrice) {
      setQrImage("/qris.jpg");
      return;
    }
    setQrisLoading(true);
    const { status, emv, qrImage } = await GenerateQRIS({
      amount: String(totalPrice),
      withFee: false,
      feeType: "r",
      feeValue: "0",
    });
    if (status) {
      setQrImage(qrImage);
    }
    setQrisLoading(false);
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
      if (needed_date) formData.append("neededDate", needed_date);
      if (needed_time) formData.append("neededTime", needed_time);
      formData.append("serviceId", service.id);
      formData.append("paperId", service.paper.id);
      formData.append("pages", String(data.pages));
      formData.append("sheets", String(sheets));
      formData.append("notes", data.notes || "");
      formData.append("courier", data.courier || "");
      formData.append("price", String(service.price || 0));
      formData.append("paymentMethod", data.payment);
      formData.append("file", uploadedFile);

      if (data.payment === "Qris" && data.receipt?.length) {
        formData.append("receipt", data.receipt[0]);
      }

      const res = await axios.post("/api/transactions/create", formData, {
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
      toast.success("Transaksi berhasil disimpan!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Submit error:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        toast.error("Gagal menyimpan transaksi: " + message, {
          description: "Silakan coba lagi atau hubungi dukungan.",
          position: "top-center",
        });
      } else {
        toast.error("Terjadi kesalahan saat menyimpan transaksi", {
          description: "Silakan coba lagi atau hubungi dukungan.",
          position: "top-center",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    GetAllCouriersRealtime((data) => {
      setCouriers(data);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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
          className="mt-5 rounded-lg px-5 md:px-0 xl:h-auto"
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
                    <p>{service.paper?.size}</p>
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
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Input
                        {...form.register("pages", { valueAsNumber: true })}
                        type="number"
                        id="pages"
                        min={1}
                        max={
                          service.duplex
                            ? service.paper?.sheets * 2
                            : service.paper?.sheets
                        }
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (
                            value >
                            service.paper?.sheets * (service.duplex ? 2 : 1)
                          ) {
                            form.setValue(
                              "pages",
                              service.paper?.sheets * (service.duplex ? 2 : 1),
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              },
                            );
                          } else {
                            form.setValue("pages", value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }
                        }}
                        placeholder={`Maksimal ${service.duplex ? (service.paper?.sheets * 2).toLocaleString() : service.paper?.sheets.toLocaleString()}`}
                        className={`col-span-3 ${
                          form.formState.errors.pages &&
                          "border-destructive focus:border-destructive"
                        }`}
                      />
                      <span className="bg-accent text-accent-foreground rounded-md p-1.5 text-center font-semibold">
                        {service.duplex
                          ? (service.paper?.sheets * 2).toLocaleString()
                          : service.paper?.sheets.toLocaleString()}
                      </span>
                    </div>
                    {form.formState.errors.pages && (
                      <span className="text-destructive text-sm">
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
                                  const yyyy = d.getFullYear();
                                  const mm = String(d.getMonth() + 1).padStart(
                                    2,
                                    "0",
                                  );
                                  const dd = String(d.getDate()).padStart(
                                    2,
                                    "0",
                                  );
                                  const yyyyMmDd = `${yyyy}-${mm}-${dd}`;
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
                          step="600"
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
                  <Textarea
                    {...form.register("notes")}
                    name="notes"
                    id="notes"
                    className="dark:bg-input/20 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border p-3 focus-visible:ring-[3px]"
                    rows={4}
                  ></Textarea>
                  {form.formState.errors.notes && (
                    <span className="text-destructive">
                      {form.formState.errors.notes.message}
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-3">
                  <Label htmlFor="payment-methods">Kurir</Label>
                  <Controller
                    name="courier"
                    control={form.control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih kurir sesuai lokasi" />
                          </SelectTrigger>
                          <SelectContent>
                            {couriers.map((courier: Courier) => (
                              <SelectItem
                                disabled={!courier.working_status}
                                key={courier.id}
                                value={courier.id}
                                className="w-full"
                              >
                                <span>{courier.profile.full_name}</span>
                                <span className="text-muted-foreground ml-auto">
                                  - {courier.area}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-destructive mt-1 text-sm"></p>
                      </div>
                    )}
                  />
                </div>
                <div className={`${qris && "grid grid-cols-2 gap-5"} mt-3`}>
                  <div className="space-y-3">
                    <Label htmlFor="payment-methods">Metode Pembayaran *</Label>

                    <Controller
                      name="payment"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="space-y-2">
                          <Select
                            disabled={totalPrice === 0 || !totalPrice}
                            value={field.value || ""} // Important: handle undefined
                            onValueChange={(value) => {
                              field.onChange(value as "Qris" | "Cash");
                              if (value === "Qris") {
                                handlePayment();
                              }

                              // Clear qris errors when switching to Cash
                              if (value === "Cash") {
                                form.clearErrors("receipt");
                              }

                              // Trigger validation to show/hide errors immediately
                              form.trigger("payment");
                            }}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                fieldState.error
                                  ? "border-destructive focus:border-destructive"
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder="Pilih metode pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Qris">QRIS</SelectItem>
                              <SelectItem value="Cash">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <p className="text-destructive mt-1 text-sm">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  {qris && (
                    <div className="space-y-3">
                      <Label htmlFor="qris-receipt">Bukti Pembayaran *</Label>
                      <Controller
                        name="receipt"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id="receipt"
                            className={`file:bg-muted file:hover:bg-accent-foreground/10 block pl-2 file:rounded-md file:px-2 ${
                              form.formState.errors.receipt
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files
                                ? Array.from(e.target.files)
                                : [];
                              field.onChange(files);
                              form.trigger("receipt");
                            }}
                          />
                        )}
                      />
                      {form.formState.errors.receipt && (
                        <p className="text-destructive mt-1 text-sm">
                          {typeof form.formState.errors.receipt?.message ===
                          "string"
                            ? form.formState.errors.receipt.message
                            : null}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative space-y-3">
              {qris ? (
                <div className="mx-auto flex items-center justify-center">
                  {qrisLoading ? (
                    <Skeleton className="h-[300px] w-[300px] rounded-md" />
                  ) : (
                    <Image
                      className="rounded-md border"
                      src={qrImage || "/qris.jpg"}
                      alt="qris"
                      width={300}
                      height={300}
                    />
                  )}
                </div>
              ) : (
                <div className="text-accent-foreground/90 border-pending-foreground/30 bg-pending-foreground/10 w-full overflow-auto rounded-md border px-4 py-3 lg:mb-0">
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
              {/* Add validation feedback at the bottom of form */}
              {/* This helps users see what's missing */}
              {!form.formState.isValid &&
                Object.keys(form.formState.errors).length > 0 && (
                  <div className="bg-destructive/10 border-destructive/20 mt-4 rounded-md border p-3 lg:mb-20">
                    <p className="text-destructive mb-2 text-sm font-medium">
                      Mohon lengkapi data berikut:
                    </p>
                    <ul className="text-destructive space-y-1 text-sm">
                      {form.formState.errors.payment && (
                        <li>• {form.formState.errors.payment.message}</li>
                      )}
                      {form.formState.errors.receipt && (
                        <li>
                          •
                          {typeof form.formState.errors.receipt?.message ===
                          "string"
                            ? form.formState.errors.receipt.message
                            : null}
                        </li>
                      )}
                      {form.formState.errors.file && (
                        <li>• File dokumen wajib diupload</li>
                      )}
                      {form.formState.errors.pages && (
                        <li>• {form.formState.errors.pages.message}</li>
                      )}
                      {form.formState.errors.datePart && (
                        <li>• {form.formState.errors.datePart.message}</li>
                      )}
                    </ul>
                  </div>
                )}
              <div className="my-auto w-full space-y-2 md:bottom-1 lg:absolute">
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
          <AlertDialog>
            <AlertDialogTrigger asChild className="w-full">
              <Button
                variant={"default"}
                type="button"
                disabled={
                  service.paper?.sheets === 0 ||
                  isSubmitting ||
                  !form.formState.isValid
                }
                className={`{${service.paper?.sheets === 0 || !form.formState.isValid ? "cursor-not-allowed" : isSubmitting ? "cursor-wait" : ""} w-full`}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : service.paper?.sheets > 0 ? (
                  "Pesan"
                ) : (
                  "Stok Habis"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Semua data yang kamu masukkan akan dikirim. Pastikan sudah
                  benar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type={`${!form.formState.isValid ? "button" : "submit"}`}
                    form="checkout-form"
                  >
                    Konfirmasi
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
