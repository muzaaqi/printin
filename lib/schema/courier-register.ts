import { z } from "zod";

export const courierRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Nama setidaknya mengandung 2 karakter")
    .max(100, "Nama harus terdiri dari paling banyak 100 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  phone: z
    .string()
    .min(10, "Nomor telepon harus terdiri dari minimal 10 karakter")
    .max(15, "Nomor telepon harus terdiri dari paling banyak 15 karakter"),
  area: z
    .string()
    .min(2, "Area harus terdiri dari minimal 2 karakter")
    .max(100, "Area harus terdiri dari paling banyak 100 karakter"),
});
export type CourierRegisterSchema = z.infer<typeof courierRegisterSchema>;
