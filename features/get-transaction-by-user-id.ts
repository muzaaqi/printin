import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export type GetTransactionByUserId = {
  id: string;
  pages: number;
  sheets: number;
  notes: string;
  payment_method: string;
  payment_status: string;
  status: string;
  total_price: number;
  created_at: string;
  needed_at: string;
  services: {
    size: string;
    color: boolean;
    duplex: boolean;
    papers: {
      size: string;
      type: string;
    }[];
  }[];
}[];

export const getTransactionByUserId = async () => {
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, pages, sheets, payment_method, payment_status, notes, status, created_at, needed_at, total_price, services(name, color, duplex, price, papers(size, type))"
    )
    .eq("user_id", user.user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
