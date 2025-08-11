import { z } from "zod";

export const checkoutSchema = z
  .object({
    file: z
      .any()
      .refine((files) => files?.length > 0, "File wajib diupload")
      .refine((files) => {
        const file = files?.[0];
        if (!file) return false;
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
          "image/jpeg",
          "image/png",
          "image/jpg",
        ];
        return allowedTypes.includes(file.type);
      }, "Tipe file harus PDF, DOC, DOCX, TXT, JPG, atau PNG")
      .refine((files) => {
        const file = files?.[0];
        if (!file) return false;
        return file.size <= 50 * 1024 * 1024;
      }, "Ukuran file maksimal 50MB"),

    pages: z
      .number("Jumlah halaman wajib diisi")
      .min(1, "Jumlah halaman wajib diisi")
      .refine((val) => val >= 1, "Jumlah halaman minimal 1")
      .refine((val) => val <= 1000, "Jumlah halaman maksimal 1000"),

    datePart: z
      .string()
      .min(1, "Tanggal wajib")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal yyyy-mm-dd"),
    timePart: z
      .string()
      .min(1, "Waktu wajib")
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Format waktu HH:MM"),

    notes: z
      .string()
      .max(150, "Catatan maksimal 150 karakter")
      .optional()
      .or(z.literal("")),

    payment: z.enum(["Qris", "Cash"], {
      message: "Metode pembayaran wajib dipilih",
    }),

    qris: z
      .any()
      .optional()
      .refine((files) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        return allowedTypes.includes(file.type);
      }, "Bukti pembayaran harus berupa gambar (JPG, PNG, WEBP)")
      .refine((files) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        return file.size <= 5 * 1024 * 1024;
      }, "Ukuran bukti pembayaran maksimal 5MB"),
  })
  .refine(
    (data) => {
      if (data.payment === "Qris") {
        return data.qris && data.qris.length > 0;
      }
      return true;
    },
    {
      message: "Bukti pembayaran wajib diupload untuk metode QRIS",
      path: ["qris"],
    }
  )
  .superRefine((val, ctx) => {
  const time = val.timePart.length === 5 ? val.timePart + ":00" : val.timePart;
  const isoSource = `${val.datePart}T${time}`;
  const d = new Date(isoSource);
  if (isNaN(d.getTime())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["datePart"], message: "Tanggal/Waktu tidak valid" });
  }
  if (d.getTime() < Date.now()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["datePart"], message: "Tidak boleh waktu lampau" });
  }
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;