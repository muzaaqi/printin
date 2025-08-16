import { supabase } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type Paper = {
  id: string;
  size: string;
  type: string;
  sheets: number;
  brand: string;
  price: number;
  image_url: string;
};


export const GetAllPapersRealtime = async (
  onChange: (papers: Paper[]) => void,
): Promise<Paper[]> => {
  // Step 1: Ambil data awal
  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .order("sheets", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  // Kirim data awal ke callback
  onChange(data as Paper[]);

  // Step 2: Buat subscription realtime
  const channel = supabase
    .channel("papers-changes")
    .on<RealtimePostgresChangesPayload<Paper>>(
      "postgres_changes",
      { event: "*", schema: "public", table: "papers" },
      async () => {
        // Ambil data terbaru setiap ada perubahan
        const { data: updatedData, error: updateError } = await supabase
          .from("papers")
          .select("*")
          .order("sheets", { ascending: false });

        if (!updateError) {
          onChange(updatedData as Paper[]);
        }
      },
    )
    .subscribe();

  // Step 3: Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
