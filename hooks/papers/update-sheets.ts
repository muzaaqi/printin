"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const updatePaperSheets = async (paperId: string, totalSheets: number) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return { success: false, error: "Authentication failed",  status: 401 };
  }

  if (typeof totalSheets !== "number" || totalSheets < 0) {
    return { success: false, error: "Invalid sheets value", status: 400 };
  }

  const { error } = await supabase
    .from("papers")
    .update({ sheets: totalSheets, updated_at: new Date() })
    .eq("id", paperId)
    .select();

  if (error) {
    return { success: false, error: "Failed to update sheets", status: 500 };
  }

  return { success: true };
}
