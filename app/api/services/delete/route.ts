import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function DELETE(req: NextRequest) {
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

  const { id } = await req.json();

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("image_path")
    .eq("id", id)
    .single();

  if (serviceError || !service) {
    return NextResponse.json({ error: serviceError?.message || "Service not found" }, { status: 500 });
  }

  const { error: storageError } = await supabase.storage
    .from("ngeprint-assets")
    .remove([service.image_path]);

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .delete()
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
