import { z } from "zod";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const validateFileType = (file: File, allowedTypes: string[]) => {
  return allowedTypes.includes(file.type);
};

const validateFileSize = (file: File, maxSize: number) => {
  return file.size <= maxSize;
};

const fileSchema = z
  .any()
  .refine((files) => {
    if (!files || files.length === 0) return false;
    const file = files[0];
    return validateFileType(file, IMAGE_TYPES);
  }, "Format file tidak didukung. Gunakan format (JPG dan PNG)")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    const file = files[0];
    const maxSize = MAX_IMAGE_SIZE;
    return validateFileSize(file, maxSize);
  }, "Ukuran file terlalu besar. Maksimak 5MB")
  .optional();

export const profileSchema = z.object({
  // email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon terlalu pendek").max(15, "Nomor telepon terlalu panjang").refine((val) => /^\d+$/.test(val), {
    message: "Nomor telepon hanya boleh terdiri dari angka",
  }),
  full_name: z.string().min(3, "Nama lengkap terlalu pendek").max(30, "Nama lengkap terlalu panjang"),
  avatar: fileSchema,
  address: z.string().min(5, "Alamat terlalu pendek").max(200, "Alamat terlalu panjang"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;