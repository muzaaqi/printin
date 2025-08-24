"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { UpdateServiceFormData } from "./types";

export const updateServiceById = async (formData: UpdateServiceFormData) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return {
      success: false,
      error: "Authentication failed",
      status: 401,
    };
  }

  const id = formData.id;
  const name = formData.name;
  const paperId = formData.paperId;
  const color = formData.color;
  const duplex = formData.duplex;
  const image = formData.image;
  const price = formData.price;

  if (!price || isNaN(price) || price < 0) {
    return { success: false, error: "Invalid price value", status: 400 };
  }

  const { data: selectData, error: selectError } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (selectError) {
    console.error("Error fetching service:", selectError);
    return {
      success: false,
      error: "Failed to fetch service",
      status: 500,
    };
  }

  let imageUrl = selectData.image_url;
  let imageFullPath = selectData.image_path;

  if (image) {
    const { error: storageError } = await supabase.storage
      .from("ngeprint-assets")
      .remove([selectData.image_path]);

    if (storageError) {
      return { succes: false, error: storageError.message, status: 500 };
    }

    const fileExt = image.name.split(".").pop();
    const safeName = name ? name.replace(/\s+/g, "_") : selectData.name.replace(/\s+/g, "_");
    const imagePath = `Services/${safeName}.${fileExt}`;

    const { data: uploadedFile, error: uploadError } = await supabase.storage
      .from("ngeprint-assets")
      .upload(imagePath, image, {
        upsert: false,
        contentType: image.type,
      });

    if (uploadError) {
      return { success: false, error: "Failed to upload image", status: 500 };
    }

    try {
      imageUrl = supabase.storage
        .from("ngeprint-assets")
        .getPublicUrl(imagePath).data.publicUrl;

      imageFullPath = uploadedFile.path;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return { succes: false, error: "Failed to get image URL", status: 500 };
    }
  }

  const { error } = await supabase
    .from("services")
    .update({
      name: name || selectData.name,
      paper_id: paperId || selectData.paperId,
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
    return {
      success: false,
      error: "Failed to update service",
      status: 500,
    };
  }

  return { success: true };
}
