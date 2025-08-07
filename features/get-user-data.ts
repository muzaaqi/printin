import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function getUserData() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}