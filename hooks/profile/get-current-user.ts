'use server'

import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = await supabase.auth.getUser();
  return await user;
}
