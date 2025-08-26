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
    if (role !== "admin") return;

    const channel = supabase
      .channel("transactions-notification")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        async (payload) => {
          if (role === "admin") {
            try {
              const {
                data,
                error,
              }: {
                data: {
                  profile: { full_name: string };
                  service: { name: string };
                } | null;
                error: Error | null;
              } = await supabase
                .from("transactions")
                .select(
                  `uid, profile:profiles(full_name), service:services(name)`,
                )
                .eq("uid", payload.new.uid)
                .single();

              if (error) throw error;

              playNotificationSound();
              toast.info("Ada Pesanan Baru!", {
                description: `${data!.profile?.full_name || "Pelanggan"} memesan ${data!.service?.name || "layanan"}`,
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
      .subscribe((status) => {
        console.log("Channel status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role, router]);

  return null;
}
