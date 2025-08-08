"use server";
import { SignUpFormData, } from "@/lib/schema/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";

export const SignUpAction = async ({ name, email, password }: SignUpFormData) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: name,
        full_name: name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/signin");
};
