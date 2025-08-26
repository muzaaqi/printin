"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const rejectCourierRequest = async (courierId: string) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return {
      success: false,
      error: "Authentication failed",
      status: 401,
    };
  }

  const { data, error } = await supabase
    .from("courier-requests")
    .update({ status: "rejected", updated_at: new Date() })
    .eq("id", courierId)
    .select();

  if (error) {
    return {
      success: false,
      error: "Failed to reject courier request",
      status: 500,
    };
  }

  return {
    success: true,
    data,
    status: 200,
  };
};
