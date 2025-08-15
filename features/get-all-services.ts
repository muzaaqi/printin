import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export interface Service {
  id: string;
  paper_id: string;
  name: string;
  image_url: string;
  price: number;
  color: boolean;
  duplex: boolean;
  // Relasi ke satu paper (karena foreign key paper_id)
  papers: {
    size: string;
    type: string;
    sheets: number;
  } // pakai null jika mungkin belum ada paper terkait
}

export type GetAllServices = Service[];

export const getAllServices = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, paper_id, name, image_url, price, color, duplex, papers(size, type, sheets)"
    );

  if (error) {
    throw new Error(error.message);
  }
  return data as GetAllServices;
};
