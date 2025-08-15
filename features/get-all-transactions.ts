import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export type Paper = {
  id: string;
  size: string;
  type: string;
  sheets: number;
  brand: string;
};

export type Service = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  color: boolean;
  duplex: boolean;
  papers: Paper;
};

export type Profile = {
  id: string;
  email: string;
  avatar_url: string;
  full_name: string;
  phone: string;
};

export type Transaction = {
  id: string;
  file_url: string;
  pages: number;
  sheets: number;
  notes: string;
  payment_method: string;
  receipt_url: string;
  payment_status: string;
  status: string;
  created_at: string;
  needed_date: string;
  needed_time: string;
  total_price: number;
  profile: Profile;
  service: Service;
};

export const getAllTransactions = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, file_url, pages, sheets, notes, payment_method, receipt_url, payment_status, status, total_price, created_at, needed_date, needed_time, profiles(id, email, avatar_url, full_name, phone), services(name, color, duplex, price, papers(size, type))",
    );

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
