"use server";
import { getCurrentUser } from "@/hooks/profile/get-current-user";
import { ProfileSchema } from "@/lib/schema/profile";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { Profile } from "./types";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";

export const updateProfile = async (userData: ProfileSchema) => {
  const supabase = await createSupabaseServerClient();
  const admin = await supabaseAdmin();

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
      status: 401,
    };
  }

  const userId = user.id;

  const { data, error }: { data: Profile | null; error: Error | null } =
    await supabase.from("profiles").select("*").eq("id", userId).single();

  if (error) {
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }

  if (!data) {
    return {
      success: false,
      error: "Profile not found",
      status: 404,
    };
  }

  if (data.avatar_path) {
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([data.avatar_path]);
    if (deleteError) {
      return {
        success: false,
        error: deleteError.message,
        status: 500,
      };
    }
  }

  let avatarUrl = data.avatar_url;
  let avatarFullPath = data.avatar_path;

  if (userData.avatar && userData.avatar.length > 0) {
    const avatarFile = userData.avatar[0];
    const fileExt = avatarFile.name.split(".").pop();
    const avatarPath = `${userId}/avatar.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("users")
      .upload(avatarPath, avatarFile, {
        upsert: true,
      });
    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
        status: 500,
      };
    }

    avatarUrl = supabase.storage.from("users").getPublicUrl(avatarPath)
      .data.publicUrl;

    avatarFullPath = uploadData.path;
  }

  const { error: authError } = await admin.auth.admin.updateUserById(userId, {
    phone: userData.phone,
    user_metadata: {
      display_name: userData.full_name,
      full_name: userData.full_name,
      avatar_url: avatarUrl,
      address: userData.address,
    },
  });

  if (authError) {
    return {
      success: false,
      error: authError.message,
      status: 500,
    };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      avatar_path: avatarFullPath,
      updated_at: new Date(),
    })
    .eq("id", userId);

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
      status: 500,
    };
  }

  return {
    success: true,
    data,
  };
};
