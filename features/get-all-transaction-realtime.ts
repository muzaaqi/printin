import { createSupabaseBrowserClient } from "@/utils/supabase/broswer-client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * Baris mentah sesuai kolom tabel 'papers'.
 * Ubah field sesuai struktur tabel sebenarnya (misal: total_sheets /  / dsb).
 */
interface TransactionRow {
  id: string;
  file_url: string;
  pages: number;
  sheets: number;
  notes: string;
  payment_method: string; // ganti sesuai nama kolom yang Anda pakai
  receipt_url: string | null;
  payment_status: string;
  status: string;
  created_at: string;
  needed_date: string;
  needed_time: string;
  total_price: number;
  user_id: string;
  user_email: string;
  user_name: string;
  user_phone: string | null;
  user_avatar: string | null;
  services: {
    name: string;
    price: number;
    color: boolean;
    duplex: boolean;
    papers: {
      size: string;
      type: string;
      sheets: number;
      brand: string;
    };
  };
}

/**
 * Model terpakai di UI.
 */
export interface Transaction {
  id: string | undefined;
  fileUrl: string;
  pages: number;
  sheets: number;
  notes: string;
  paymentMethod: string; // ganti sesuai nama kolom yang Anda pakai
  receiptUrl: string | null;
  paymentStatus: string;
  status: string;
  createdAt: string;
  neededDate: string;
  neededTime: string;
  totalPrice: number;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string | null;
  userAvatar: string | null;
  services: {
    name: string;
    price: number;
    color: boolean;
    duplex: boolean;
    papers: {
      size: string;
      type: string;
      sheets: number;
      brand: string;
    };
  };
}

/**
 * Adaptasi baris dari database ke model UI.
 */
function adapt(row: TransactionRow): Transaction {
  return {
    id: row.id,
    fileUrl: row.file_url,
    pages: row.pages,
    sheets: row.sheets,
    notes: row.notes,
    paymentMethod: row.payment_method,
    receiptUrl: row.receipt_url,
    paymentStatus: row.payment_status,
    status: row.status,
    createdAt: row.created_at,
    neededDate: row.needed_date,
    neededTime: row.needed_time,
    totalPrice: row.total_price,
    userId: row.user_id,
    userEmail: row.user_email,
    userName: row.user_name,
    userPhone: row.user_phone,
    userAvatar: row.user_avatar,
    services: {
      name: row.services.name,
      price: row.services.price,
      color: row.services.color,
      duplex: row.services.duplex,
      papers: {
        size: row.services.papers.size,
        type: row.services.papers.type,
        sheets: row.services.papers.sheets,
        brand: row.services.papers.brand,
      },
    },
  };
}

type TransactionsMap = Map<string, Transaction>;

/**
 * Subscribe realtime jumlah lembar tiap kertas.
 * @param onChange dipanggil setiap ada perubahan (awal + realtime) dengan array terbaru.
 * @returns fungsi untuk berhenti berlangganan.
 */
export async function subscribeTransaction(
  onChange: (transactions: Transaction[]) => void
): Promise<() => void> {
  const client = createSupabaseBrowserClient();

  // Pastikan token realtime ter-set (opsional jika sudah otomatis).
  const { data: sessionData, error: sessionError } =
    await client.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  client.realtime.setAuth(sessionData.session?.access_token);

  // Simpan state lokal agar mudah di-update incremental.
  const transactionsMap: TransactionsMap = new Map();

  // Ambil data awal.
  const { data: initialRows, error: initialError } = await client
    .from("transactions")
    .select("id, user_id, user_email, user_name, user_phone, user_avatar, file_url, pages, sheets, notes, payment_method, receipt_url, payment_status, status, created_at, needed_date, needed_time, total_price, services(name, price, color, duplex, papers(size, type, sheets, brand))")
    .eq("status", "Pending")
    .order("created_at", { ascending: false });

  if (initialError) {
    throw new Error(initialError.message);
  }

  if (initialRows) {
    for (const row of (initialRows as unknown as TransactionRow[])) {
      transactionsMap.set(row.id, adapt(row));
    }
  }

  // Trigger pertama ke UI.
  onChange(Array.from(transactionsMap.values()));

  // Langganan perubahan Postgres (INSERT, UPDATE, DELETE).
  const channel = client
    .channel("public:transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      (payload: RealtimePostgresChangesPayload<TransactionRow>) => {
        switch (payload.eventType) {
          case "INSERT":
          case "UPDATE": {
            if (payload.new) {
              transactionsMap.set(payload.new.id, adapt(payload.new));
            }
            break;
          }
          case "DELETE": {
            if (payload.old && payload.old.id) {
              transactionsMap.delete(payload.old.id);
            }
            break;
          }
        }
        onChange(Array.from(transactionsMap.values()));
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
