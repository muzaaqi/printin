import { createSupabaseBrowserClient } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface PaperRow {
  id: string;
  brand: string;
  size: string;
  type: string;
  sheets: number;
  price: number;
}

export interface Paper {
  id: string | undefined;
  brand: string;
  size: string;
  type: string;
  remainingSheets: number;
  price: number;
}

function adapt(row: PaperRow): Paper {
  return {
    id: row.id,
    brand: row.brand,
    size: row.size,
    type: row.type,
    remainingSheets: row.sheets,
    price: row.price,
  };
}

type PapersMap = Map<string, Paper>;

export const subscribePapers = async (
  onChange: (papers: Paper[]) => void,
): Promise<() => void> => {
  const client = createSupabaseBrowserClient();

  const papersMap: PapersMap = new Map();
  let initialDataLoaded = false;

  // 1. Load initial data
  const { data: initialRows, error } = await client
    .from("papers")
    .select("id, size, type, sheets, brand, price")
    .order("sheets", { ascending: true });

  if (error) throw new Error(error.message);

  for (const row of (initialRows ?? []) as PaperRow[]) {
    papersMap.set(row.id, adapt(row));
  }
  initialDataLoaded = true;
  onChange(Array.from(papersMap.values()));

  // 2. Subscribe realtime
  const channel = client
    .channel("public:papers")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "papers" },
      (payload: RealtimePostgresChangesPayload<PaperRow>) => {
        if (!initialDataLoaded) return;

        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          if (payload.new) {
            papersMap.set(payload.new.id, adapt(payload.new));
          }
        } else if (payload.eventType === "DELETE") {
          if (payload.old && payload.old.id) {
            papersMap.delete(payload.old.id);
          }
        }

        onChange(Array.from(papersMap.values()));
      },
    )
    .subscribe((status, err) => {
      if (err) console.error("Realtime error:", err);
    });

  // 3. Cleanup
  return () => {
    channel.unsubscribe();
  };
};

