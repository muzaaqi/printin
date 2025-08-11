import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export type GetAllTransactions = {
  id: string;
  file_url: string;
  pages: number;
  sheets: number;
  notes: string;
  payment_method: string;
  receipt_url: string;
  payment_status: string;
  status: string;
  total_price: number;
  created_at: string;
  needed_at: string;
  auth: {
    full_name: string;
    display_name: string;
    avatar_url: string;
    email: string;
    phone: string;
  };
  services: {
    size: string;
    color: boolean;
    duplex: boolean;
    price: number;
    papers: {
      size: string;
      type: string;
    }[];
  }[];
}[];

export const getAllTransactions = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, file_url, pages, sheets, notes, payment_method, receipt_url, payment_status, status, total_price, created_at, needed_at, auth(full_name, display_name, avatar_url, email, phone), services(size, color, duplex, price, papers(size, type))"
    );

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
