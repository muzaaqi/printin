"use server";
import { signUpSchema } from "@/lib/schema/signup";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";


type SignUpFormState =
  | {
      success: boolean;
      errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    } | undefined;

export const SignUpAction = async (_state: SignUpFormState | undefined,
  formData: FormData
): Promise<SignUpFormState> => {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      errors: fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
