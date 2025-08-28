import { supabase } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Profile } from "./get-all-transactions";

export type Courier = {
  id: string;
  working_status: string;
  area: string;
  profile: Profile;
};

export const GetCourierByIdRealtime = async (
  onChange: (couriers: Courier[]) => void,
  userId: string,
): Promise<Courier[]> => {
  const { data, error } = await supabase
    .from("couriers")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .eq("id", userId)
    .order("working_status", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  onChange(data as unknown as Courier[]);

  const channel = supabase
    .channel("working-status-changes")
    .on<RealtimePostgresChangesPayload<Courier>>(
      "postgres_changes",
      { event: "*", schema: "public", table: "couriers" },
      async () => {
        const { data: updatedData, error: updateError } = await supabase
          .from("couriers")
          .select(
            `
            *,
            profile:profiles(*)
          `,
          )
          .eq("id", userId)
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
