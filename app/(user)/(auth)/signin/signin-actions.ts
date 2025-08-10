"use server";
import type { SignInFormData } from "@/lib/schema/signin";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function SignInAction(formData: SignInFormData) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) return { success: false, message: error.message };

  return { success: true };
}

