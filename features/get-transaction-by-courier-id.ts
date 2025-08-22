import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export type GetTransactionByCourierId = {
  id: string;
  pages: number;
  sheets: number;
  notes: string;
  payment_method: string;
  payment_status: string;
  status: string;
  total_price: number;
  created_at: string;
  needed_date: string;
  needed_time: string;
  profile: {
    full_name: string;
    phone: string;
    avatar_url?: string; // optional kalau ga selalu ada
  }[];
  service: {
    name: string;
    size: string;
    color: boolean;
    duplex: boolean;
    paper: {
      size: string;
      type: string;
    }[];
  }[];
}[];

export const getTransactionByCourierId = async () => {
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, pages, sheets, payment_method, payment_status, notes, status, created_at, needed_date, needed_time, total_price, service:services(name, color, duplex, price, paper:papers(size, type)), profile:profiles(full_name, phone, avatar_url))",
    )
    .eq("courier_id", user.user?.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
