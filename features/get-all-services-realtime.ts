import { supabase } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type Paper = {
  id: string;
  size: string;
  type: string;
  sheets: number;
  brand: string;
};

export type Services = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  color: boolean;
  duplex: boolean;
  paper: Paper;
};

export const GetAllServicesStokRealtime = async (
  onChange: (services: Services[]) => void,
): Promise<Services[]> => {
  // Step 1: Ambil data awal
  const { data, error } = await supabase
    .from("services")
    .select(
      `
        *,
        paper:papers(*)
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // Kirim data awal ke callback
  onChange(data as Services[]);

  // Step 2: Buat subscription realtime
  const channel = supabase.channel("services-changes");

  channel
    .on<RealtimePostgresChangesPayload<Services>>(
      "postgres_changes",
      { event: "*", schema: "public", table: "papers" },
      async () => {
        // Ambil data terbaru setiap ada perubahan
        const { data: updatedData, error: updateError } = await supabase
          .from("services")
          .select(
            `
            *,
            paper:papers(*)
          `,
          )
          .order("created_at", { ascending: false });

        if (!updateError) {
          onChange(updatedData as Services[]);
        }
      },
    )
    .subscribe();

  // Step 3: Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
