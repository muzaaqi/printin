import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {data: {user}, error} = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  return user;
}