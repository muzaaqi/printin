import { supabase } from "@/utils/supabase/broswer-client";
import { Courier } from "./couriers-types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const getAllCourierRequests = async (
  onChange: (couriers: Courier) => void,
): Promise<Courier> => {
  const { data, error } = await supabase
    .from("courier-requests")
    .select("*, profile:profiles(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  onChange(data as unknown as Courier);

  const channel = supabase
    .channel("courier-requests-changes")
    .on<RealtimePostgresChangesPayload<Courier>>(
      "postgres_changes",
      { event: "*", schema: "public", table: "couriers" },
      async () => {
        const { data: updatedData, error: updateError } = await supabase
          .from("courier-requests")
          .select("*, profile:profiles(*)")
          .order("created_at", { ascending: false });

        if (!updateError) {
          onChange(updatedData as unknown as Courier);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
