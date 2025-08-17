import { supabase } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Profile } from "./get-all-transactions";

export type Courier = {
  id: string;
  working_status: string;
  area: string;
  profile: Profile;
};

export const GetAllCouriersRealtime = async (
  onChange: (couriers: Courier[]) => void,
): Promise<Courier[]> => {
  // Step 1: Ambil data awal
  const { data, error } = await supabase
    .from("couriers")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .order("working_status", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // Kirim data awal ke callback
  onChange(data as unknown as Courier[]);

  // Step 2: Buat subscription realtime
  const channel = supabase
    .channel("couriers-changes")
    .on<RealtimePostgresChangesPayload<Courier>>(
      "postgres_changes",
      { event: "*", schema: "public", table: "couriers" },
      async () => {
        // Ambil data terbaru setiap ada perubahan
        const { data: updatedData, error: updateError } = await supabase
          .from("couriers")
          .select(
            `
            *,
            profile:profiles(*)
          `,
          )
          .order("working_status", { ascending: false });

        if (!updateError) {
          onChange(updatedData as unknown as Courier[]);
        }
      },
    )
    .subscribe();

  // Step 3: Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
