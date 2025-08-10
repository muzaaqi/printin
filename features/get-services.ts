import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const getServices = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("services").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
