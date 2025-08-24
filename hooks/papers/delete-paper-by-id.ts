"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const deletePaperById = async (paperId: string) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return { error: "Authentication failed", status: 401, success: false };
  }

  const { data: selectData, error: selectError } = await supabase
    .from("papers")
    .select("image_path")
    .eq("id", paperId)
    .single();

  if (selectError) {
    console.error("Error fetching paper:", selectError);
    return { error: "Failed to fetch paper", status: 500, success: false };
  }

  const { error: storageError } = await supabase.storage
    .from("ngeprint-assets")
    .remove([selectData.image_path]);

  if (storageError) {
    return { error: storageError.message, status: 500, success: false };
  }

  const { error } = await supabase
    .from("papers")
    .delete()
    .eq("id", paperId)
    .select();

  if (error) {
    return { error: "Failed to delete paper", status: 500, success: false };
  }

  return { success: true };
};
