import { z } from "zod";

// Supported file types - organized by category
const DOCUMENT_TYPES = [
  // Microsoft Office
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

  // Google Workspace (when downloaded)
  "application/vnd.google-apps.document", // Google Docs
  "application/vnd.google-apps.spreadsheet", // Google Sheets
  "application/vnd.google-apps.presentation", // Google Slides

  // Other popular formats
  "application/rtf", // Rich Text Format
  "text/plain", // .txt
  "text/csv", // .csv

  // Open Document Format (LibreOffice, etc)
  "application/vnd.oasis.opendocument.text", // .odt
  "application/vnd.oasis.opendocument.spreadsheet", // .ods
  "application/vnd.oasis.opendocument.presentation", // .odp
];

const IMAGE_TYPES = [
  "image/jpeg", // .jpg, .jpeg
  "image/png", // .png
  "image/webp", // .webp
  "image/gif", // .gif
  "image/bmp", // .bmp
  "image/tiff", // .tiff
  "image/svg+xml", // .svg
];

const ALL_ALLOWED_TYPES = [...DOCUMENT_TYPES, ...IMAGE_TYPES];

// File size limits (in bytes)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for documents
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images
const MAX_RECEIPT_SIZE = 5 * 1024 * 1024; // 5MB for receipt

// Reusable file validation functions
const validateFileType = (file: File, allowedTypes: string[]) => {
  return allowedTypes.includes(file.type);
};

const validateFileSize = (file: File, maxSize: number) => {
  return file.size <= maxSize;
};

const getFileMaxSize = (fileType: string) => {
  return IMAGE_TYPES.includes(fileType) ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
};

// Base file validation schema
const fileSchema = z
  .any()
  .refine((files) => files?.length > 0, "File wajib diupload")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    const file = files[0];
    return validateFileType(file, ALL_ALLOWED_TYPES);
  }, "Format file tidak didukung. Gunakan format dokumen (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, etc) atau gambar (JPG, PNG, WEBP, GIF)")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    const file = files[0];
    const maxSize = getFileMaxSize(file.type);
    return validateFileSize(file, maxSize);
  }, "Ukuran file terlalu besar. Maksimal 50MB untuk dokumen, 10MB untuk gambar");

// Multiple files schema (commented for future use)
/*
const multipleFilesSchema = z
  .any()
  .refine((files) => files?.length > 0, "Minimal 1 file wajib diupload")
  .refine((files) => files?.length <= 5, "Maksimal 5 file dapat diupload")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    return Array.from(files).every((file: File) => 
      validateFileType(file, ALL_ALLOWED_TYPES)
    );
  }, "Semua file harus dalam format yang didukung")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    return Array.from(files).every((file: File) => {
      const maxSize = getFileMaxSize(file.type);
      return validateFileSize(file, maxSize);
    });
  }, "Ukuran setiap file tidak boleh melebihi batas maksimal")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    const totalSize = Array.from(files).reduce((acc: number, file: File) => acc + file.size, 0);
    return totalSize <= 100 * 1024 * 1024; // 100MB total
  }, "Total ukuran semua file maksimal 100MB");
*/

// Receipt image validation
const receiptSchema = z
  .any()
  .optional()
  .refine((files) => {
    if (!files || files.length === 0) return true;
    const file = files[0];
    return validateFileType(file, IMAGE_TYPES);
  }, "Bukti pembayaran harus berupa gambar (JPG, PNG, WEBP, GIF)")
  .refine((files) => {
    if (!files || files.length === 0) return true;
    const file = files[0];
    return validateFileSize(file, MAX_RECEIPT_SIZE);
  }, "Ukuran bukti pembayaran maksimal 5MB");

// Courier validation schema (for future use)

const courierSchema = z.object({
  id: z.string().min(1, "Kurir wajib dipilih"),
  name: z.string().min(1, "Nama kurir tidak valid"),
  area: z.string().min(1, "Area kurir tidak valid"),
  fee: z.number().min(0, "Biaya kurir tidak valid"),
});


// Main checkout schema
export const checkoutSchema = z
  .object({
    // File upload - single file (required)
    file: fileSchema,

    // Multiple files (commented for future use)
    // files: multipleFilesSchema,

    // Page count validation
    pages: z
      .number({ message: "Jumlah halaman wajib diisi" })
      .int("Jumlah halaman harus berupa bilangan bulat")
      .min(1, "Jumlah halaman minimal 1")
      .max(1000, "Jumlah halaman maksimal 1000"),

    // Date validation - required
    datePart: z
      .string({ message: "Tanggal wajib dipilih" })
      .min(1, "Tanggal wajib dipilih")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),

    // Date validation - optional (commented for future use)
    /*
    datePart: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
      .optional()
      .or(z.literal("")),
    */

    // Time validation - required
    timePart: z
      .string({ message: "Waktu wajib dipilih" })
      .min(1, "Waktu wajib dipilih")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Format waktu harus HH:MM (24 jam)",
      ),
      

    // Time validation - optional (commented for future use)
    /*
    timePart: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu harus HH:MM (24 jam)")
      .optional()
      .or(z.literal("")),
    */

    // Notes - optional with length limit
    notes: z
      .string()
      .max(500, "Catatan maksimal 500 karakter")
      .optional()
      .or(z.literal("")),

    // Payment method - required
    payment: z.enum(["Qris", "Cash"], {
      message: "Metode pembayaran wajib dipilih",
    }),

    // QRIS receipt - conditional
    receipt: receiptSchema,

    // Courier selection (commented for future use)

    courier: z
      .string()
      .min(1, "Kurir wajib dipilih")
      .optional(),
    
    courierDetails: courierSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // QRIS payment validation
    if (data.payment === "Qris") {
      if (!data.receipt || data.receipt.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["receipt"],
          message: "Bukti pembayaran wajib diupload untuk metode QRIS",
        });
      }
    }

    // Date/time validation - required version
    if (data.datePart && data.timePart) {
      try {
        const dateTimeString = `${data.datePart}T${data.timePart}:00`;
        const dateTime = new Date(dateTimeString);

        if (isNaN(dateTime.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["datePart"],
            message: "Tanggal/waktu tidak valid",
          });
          return;
        }

        // Must be future date/time (with 1 hour buffer for processing)
        const now = new Date();
        const minTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

        if (dateTime.getTime() <= minTime.getTime()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["datePart"],
            message: "Tanggal/waktu minimal 1 jam dari sekarang",
          });
        }
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["datePart"],
          message: "Format tanggal/waktu tidak valid",
        });
      }
    }

    // Date/time validation - optional version (commented for future use)
    /*
    if ((data.datePart && !data.timePart) || (!data.datePart && data.timePart)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["datePart"],
        message: "Jika mengisi tanggal, waktu juga harus diisi (dan sebaliknya)",
      });
    }
    
    if (data.datePart && data.timePart) {
      // Same validation as above
    }
    */

    // Courier validation (commented for future use)
    /*
    if (data.courier && !data.courierDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["courier"],
        message: "Data kurir tidak valid",
      });
    }
    */
  });

// Export types
export type CheckoutSchema = z.infer<typeof checkoutSchema>;

// Export constants for use in components
export const FILE_TYPES = {
  DOCUMENT_TYPES,
  IMAGE_TYPES,
  ALL_ALLOWED_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  MAX_RECEIPT_SIZE,
};

// Utility functions for components
export const getFileTypeDescription = (includeImages = true) => {
  const docs = "PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, RTF";
  const images = "JPG, PNG, WEBP, GIF, BMP, SVG";

  return includeImages ? `${docs}, ${images}` : docs;
};

export const validateSingleFile = (file: File) => {
  const typeValid = validateFileType(file, ALL_ALLOWED_TYPES);
  const sizeValid = validateFileSize(file, getFileMaxSize(file.type));

  return {
    isValid: typeValid && sizeValid,
    typeError: !typeValid ? "Format file tidak didukung" : null,
    sizeError: !sizeValid ? "Ukuran file terlalu besar" : null,
  };
};
