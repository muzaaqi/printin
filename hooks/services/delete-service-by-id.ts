"use server"
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const deleteServiceById = async (serviceId: string) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return {success: false, error: "Authentication failed", status: 401 };
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("image_path")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    return { success: false, error: serviceError?.message || "Service not found", status: 500 };
  }

  const { error: storageError } = await supabase.storage
    .from("ngeprint-assets")
    .remove([service.image_path]);

  if (storageError) {
    return { success: false, error: storageError.message, status: 500 };
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId)
      .single();

    if (error) {
      return { success: false, error: error.message, status: 500 };
    }

    return { success: true, };
  } catch (error) {
    return { success: false, error: "Failed to update transaction", status: 500 };
  }
}
