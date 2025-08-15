import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }

  let form: FormData;
  try {
    form = await Promise.race([
      req.formData(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("FormData parsing timeout")), 15000),
      ),
    ]);
  } catch (parseError) {
    console.error("FormData parsing error:", parseError);
    return NextResponse.json(
      { error: "Gagal memproses data form" },
      { status: 400 },
    );
  }

  const transactionId = req.nextUrl.pathname.split("/").pop();
  const transactionStatus = form.get("status") as string;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({ status: transactionStatus })
      .eq("id", transactionId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}
