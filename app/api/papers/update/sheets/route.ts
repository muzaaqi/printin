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

  const { paperId, totalSheets } = await req.json();

  if (typeof totalSheets !== "number" || totalSheets < 0) {
    return NextResponse.json(
      { error: "Invalid sheets value" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("papers")
    .update({ sheets: totalSheets, updated_at: new Date() })
    .eq("id", paperId)
    .select();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update sheets" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}
