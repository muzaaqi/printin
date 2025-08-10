import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const getTransactionByUserId = async () => {
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, services(serviceName, paperSize)")
    .eq("userId", user.user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
