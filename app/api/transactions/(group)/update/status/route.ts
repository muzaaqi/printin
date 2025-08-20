import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }

  let id: string;
  let transactionStatus: string;
  try {
    const body = await req.json();
    id = body.id;
    transactionStatus = body.status;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const allowedStatus = ["Pending", "In Process", "Completed"];
  if (!allowedStatus.includes(transactionStatus)) {
    return NextResponse.json(
      { error: "Invalid transaction status" },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({ status: transactionStatus, updated_at: new Date() })
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}
