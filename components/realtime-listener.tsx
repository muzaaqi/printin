"use client";
import { playNotificationSound } from "@/features/notification";
import { useUserRole } from "@/hooks/get-user-role";
import { supabase } from "@/utils/supabase/broswer-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RealtimeListener() {
  const role = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (role !== "admin") return; // hanya attach kalau valid

    const channel = supabase
      .channel("transactions-notification")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        async (payload) => {
          if (role === "admin") {
            try {
              const { data, error } = await supabase
                .from("transactions")
                .select(`id, profiles(full_name), services(name)`)
                .eq("id", payload.new.id)
                .single();

              if (error) throw error;

              playNotificationSound();
              toast.info("Ada Pesanan Baru!", {
                description: `${data.profiles?.full_name || "Pelanggan"} memesan ${data.services?.name || "layanan"}`,
                duration: 5000,
                action: {
                  label: "Lihat",
                  onClick: () => router.push("/dashboard"),
                },
              });
            } catch (err) {
              console.error("Realtime error:", err);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role, router]);

  return null;
}
