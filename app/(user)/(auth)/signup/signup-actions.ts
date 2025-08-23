"use server";
import { SignUpFormData } from "@/lib/schema/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const SignUpAction = async ({
  name,
  email,
  phone,
  password,
}: SignUpFormData) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    phone: phone,
    options: {
      data: {
        display_name: name,
        full_name: name,
        role: "user",
        address: null,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
