import { createSupabaseBrowserClient } from "@/utils/supabase/broswer-client";


export const updateTransactionStatus = async (id: string, status: string) => {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", id);
  return { data, error };
};