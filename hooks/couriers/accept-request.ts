"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";

const UpdateStatus = async (
  supabase,
  courierId: string,
  status: string | null,
) => {
  const { data, error } = await supabase
    .from("courier-requests")
    .update({ status, updated_at: new Date() })
    .eq("id", courierId)
    .select()
    .single();

  if (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to accept courier request",
      status: 500,
    };
  }
  return data;
};

export const acceptCourierRequest = async (courierId: string) => {
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

  const data = await UpdateStatus(supabase, courierId, "accepted");

  const admin = await supabaseAdmin();
  const { error: userError } = await admin.auth.admin.updateUserById(
    data.user_id,
    {
      email: data.email,
      phone: data.phone,
      user_metadata: {
        full_name: data.full_name,
        role: "courier",
      },
    },
  );

  if (userError) {
    await UpdateStatus(supabase, courierId, null);
    console.log(userError);
    const { error } = await admin.auth.admin.updateUserById(
      data.user_id,
      {
        email: data.email,
        phone: data.phone,
        user_metadata: {
          full_name: data.full_name,
          role: "user",
        },
      },
    );
    return {
      success: false,
      error: "Failed to update user",
      status: 500,
    };
  }

  const { error: CourierError } = await supabase.from("couriers").insert({
    id: data.user_id,
    area: data.area,
  });

  if (CourierError) {
    return {
      success: false,
      error: "Failed to create courier",
      status: 500,
    };
  }

  return {
    success: true,
    data,
    status: 200,
  };
};
