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

export const subscribePaper = async (
  onChange: (papers: Paper[]) => void
): Promise<() => void> => {
  const client = createSupabaseBrowserClient();

  const { data: sessionData, error: sessionError } =
    await client.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  client.realtime.setAuth(sessionData.session?.access_token);

  const papersMap: PapersMap = new Map();

  const { data: initialRows, error: initialError } = await client
    .from("papers")
    .select("id, size, type, sheets, brand, price")
    .order("sheets", { ascending: true });

  if (initialError) {
    throw new Error(initialError.message);
  }

  if (initialRows) {
    for (const row of initialRows as PaperRow[]) {
      papersMap.set(row.id, adapt(row));
    }
  }

  onChange(Array.from(papersMap.values()));

  const channel = client
    .channel("public:papers")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "papers" },
      (payload: RealtimePostgresChangesPayload<PaperRow>) => {
        switch (payload.eventType) {
          case "INSERT":
          case "UPDATE": {
            if (payload.new) {
              papersMap.set(payload.new.id, adapt(payload.new));
            }
            break;
          }
          case "DELETE": {
            if (payload.old && payload.old.id) {
              papersMap.delete(payload.old.id);
            }
            break;
          }
        }
        onChange(Array.from(papersMap.values()));
      }
    )
    .subscribe((status, err) => {
      if (err) {
        console.error("Realtime subscription error:", err);
      }
      if (status === "SUBSCRIBED") {
      }
    });

  const { data: authListener } = client.auth.onAuthStateChange(
    (_event, session) => {
      client.realtime.setAuth(session?.access_token);
    }
  );

  return () => {
    channel.unsubscribe();
    authListener.subscription.unsubscribe();
  };
}
