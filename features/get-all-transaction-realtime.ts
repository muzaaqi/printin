import { supabase } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
  paper: Paper;
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

export const GetAllTransactionRealtime = async (
  onChange: (transactions: Transaction[]) => void,
): Promise<Transaction[]> => {
  // Step 1: Ambil data awal
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      profile:profiles(*),
      service:services(
        *,
        paper:papers(*)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // Kirim data awal ke callback
  onChange(data as Transaction[]);

  // Step 2: Buat subscription realtime
  const channel = supabase
    .channel("transactions-changes")
    .on<RealtimePostgresChangesPayload<Transaction>>(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      async () => {
        // Ambil data terbaru setiap ada perubahan
        const { data: updatedData, error: updateError } = await supabase
          .from("transactions")
          .select(
            `
            *,
            profile:profiles(*),
            service:services(
              *,
              paper:papers(*)
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (!updateError) {
          onChange(updatedData as Transaction[]);
        }
      },
    )
    .subscribe();

  // Step 3: Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
