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

    color: z.enum(["Hitam-Putih", "Berwarna"], {
      message: "Pilihan warna wajib dipilih"
    }),

    side: z.enum(["Satu-Sisi", "Dua-Sisi"], {
      message: "Pilihan sisi wajib dipilih"
    }),

    pages: z
      .number("Jumlah halaman wajib diisi")
      .min(1, "Jumlah halaman wajib diisi")
      .refine((val) => val >= 1, "Jumlah halaman minimal 1")
      .refine((val) => val <= 1000, "Jumlah halaman maksimal 1000"),

    date: z
  .string()
  .min(1, "Tanggal dan waktu wajib diisi")
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Format tanggal & waktu tidak valid (YYYY-MM-DDTHH:MM)")
  // Validasi tanggal minimal hari ini
  .refine((dateStr) => {
    const selectedDateTime = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDateTime >= today;
  }, "Tanggal tidak boleh kurang dari hari ini")
  // Validasi tanggal maksimal 30 hari dari sekarang
  .refine((dateStr) => {
    const selectedDateTime = new Date(dateStr);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return selectedDateTime <= maxDate;
  }, "Tanggal maksimal 30 hari dari sekarang")
  // Validasi waktu antara jam 08:00 - 17:00
  .refine((dateStr) => {
    const selectedDateTime = new Date(dateStr);
    const hours = selectedDateTime.getHours();
    const minutes = selectedDateTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 8 * 60;  // 08:00
    const maxMinutes = 17 * 60; // 17:00
    return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
  }, "Waktu harus antara jam 08:00 - 17:00"),


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
  );

export type CheckoutSchema = z.infer<typeof checkoutSchema>;