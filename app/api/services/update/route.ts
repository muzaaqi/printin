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

  const formData = await req.formData();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const paperId = formData.get("paperId") as string;
  const color = formData.get("color") as string;
  const duplex = formData.get("duplex") as string;
  const image = formData.get("image") as File | null;
  const price = Number(formData.get("price"));

  if (isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
  }

  const { data: selectData, error: selectError } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (selectError) {
    console.error("Error fetching service:", selectError);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 },
    );
  }

  let imageUrl = selectData.image_url;
  let imageFullPath = selectData.image_path;

  if (image) {
    const { error: storageError } = await supabase.storage
      .from("ngeprint-assets")
      .remove([selectData.image_path]);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 },
      );
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

    try {
      imageUrl = supabase.storage
        .from("ngeprint-assets")
        .getPublicUrl(imagePath).data.publicUrl;

      imageFullPath = uploadedFile.path;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return NextResponse.json(
        { error: "Failed to get image URL" },
        { status: 500 },
      );
    }
  }

  const { data, error } = await supabase
    .from("services")
    .update({
      name: name || selectData.name,
      paperId: paperId || selectData.paperId,
      color: color || selectData.color,
      duplex: duplex || selectData.duplex,
      image_path: imageFullPath,
      image_url: imageUrl,
      price: price || selectData.price,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}
