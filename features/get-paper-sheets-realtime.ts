import { createSupabaseBrowserClient } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * Baris mentah sesuai kolom tabel 'papers'.
 * Ubah field sesuai struktur tabel sebenarnya (misal: total_sheets /  / dsb).
 */
interface PaperRow {
  id: string;
  brand: string;
  size: string;
  type: string;
  sheets: number; // ganti sesuai nama kolom yang Anda pakai
}

/**
 * Model terpakai di UI.
 */
export interface Paper {
  id: string | undefined;
  brand: string;
  size: string;
  type: string;
  remainingSheets: number;
}

/**
 * Adaptasi baris dari database ke model UI.
 */
function adapt(row: PaperRow): Paper {
  return {
    id: row.id,
    brand: row.brand,
    size: row.size,
    type: row.type,
    remainingSheets: row.sheets,
  };
}

type PapersMap = Map<string, Paper>;

/**
 * Subscribe realtime jumlah lembar tiap kertas.
 * @param onChange dipanggil setiap ada perubahan (awal + realtime) dengan array terbaru.
 * @returns fungsi untuk berhenti berlangganan.
 */
export async function subscribePaperRemainingSheets(
  onChange: (papers: Paper[]) => void
): Promise<() => void> {
  const client = createSupabaseBrowserClient();

  // Pastikan token realtime ter-set (opsional jika sudah otomatis).
  const { data: sessionData, error: sessionError } =
    await client.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  client.realtime.setAuth(sessionData.session?.access_token);

  // Simpan state lokal agar mudah di-update incremental.
  const papersMap: PapersMap = new Map();

  // Ambil data awal.
  const { data: initialRows, error: initialError } = await client
    .from("papers")
    .select("id, size, type, sheets, brand")
    .order("updated_at", { ascending: true });

  if (initialError) {
    throw new Error(initialError.message);
  }

  if (initialRows) {
    for (const row of initialRows as PaperRow[]) {
      papersMap.set(row.id, adapt(row));
    }
  }

  // Trigger pertama ke UI.
  onChange(Array.from(papersMap.values()));

  // Langganan perubahan Postgres (INSERT, UPDATE, DELETE).
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
        // Opsional: console.log("Realtime papers subscribed");
      }
    });

  // Auto refresh token saat berubah (opsional agar channel tetap authorized).
  const { data: authListener } = client.auth.onAuthStateChange(
    (_event, session) => {
      client.realtime.setAuth(session?.access_token);
    }
  );

  // Fungsi unsubscribe.
  return () => {
    channel.unsubscribe();
    authListener.subscription.unsubscribe();
  };
}
