"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { getCurrentUser } from "../hooks/profile/get-current-user";

export async function updateWorkingStatus(status: boolean) {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("couriers")
    .update({ working_status: status })
    .eq("id", user?.id);
  if (error) {
    return false;
  }
  return true;
}
