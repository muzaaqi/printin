import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export async function POST(req: NextRequest) {
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

  const formData = await req.formData();

  console.log("Received form data:", formData);

  const name = formData.get("name") as string;
  const paperId = formData.get("paperId") as string;
  const color = Boolean(formData.get("color"));
  const duplex = Boolean(formData.get("duplex"));
  const image = formData.get("image") as File | null;
  const price = Number(formData.get("price"));

  if (isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
  }

  if (!image) {
    return NextResponse.json({ error: "Image file required" }, { status: 400 });
  }

  const fileExt = image.name.split(".").pop();
  const safeName = name.replace(/\s+/g, "_");
  const imagePath = `Services/${safeName}.${fileExt}`;

  const { data: uploadedFile, error: uploadError } = await supabase.storage
    .from("ngeprint-assets")
    .upload(imagePath, image, {
      upsert: false,
      contentType: image.type,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }

  const imageUrl = supabase.storage
    .from("ngeprint-assets")
    .getPublicUrl(imagePath).data.publicUrl;

  const imageFullPath = uploadedFile.path;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Failed to get image URL" },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      name: name,
      paper_id: paperId,
      color: color,
      duplex: duplex,
      image_path: imageFullPath,
      image_url: imageUrl,
      price: price,
    })
    .select();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}
