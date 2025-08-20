import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export type GetAllPapers = {
  id: string;
  size: string;
  brand: string;
  image_url: string;
  type: string;
  price: number;
  sheets: number;
}[];

export const getAllPapers = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("papers")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
