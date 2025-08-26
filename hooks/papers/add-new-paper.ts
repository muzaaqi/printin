"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { InsertPaperFormData } from "./type";

export const addNewPaper = async (formData: InsertPaperFormData) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return { success: false, error: "Authentication failed", status: 401 };
  }

  const { sheets, brand, size, type, price, image } = formData;

  if (!price || isNaN(price) || price < 0) {
    return { success: false, error: "Invalid price value", status: 400 };
  }

  if (!image) {
    return { success: false, error: "Image file required", status: 400 };
  }

  const safeBrand = brand && brand.replace(/\s+/g, "_");
  const fileExt = image.name.split(".").pop();
  const imagePath = `Papers/${safeBrand}/${size}/PAPER-${type}.${fileExt}`;

  const { data: uploadedFile, error: uploadError } = await supabase.storage
    .from("ngeprint-assets")
    .upload(imagePath, image, {
      upsert: false,
      contentType: image.type,
    });

  if (uploadError) {
    return {
      success: false,
      error: "Failed to upload image",
      status: 500,
    };
  }

  const imageUrl = supabase.storage
    .from("ngeprint-assets")
    .getPublicUrl(imagePath).data.publicUrl;

  const imageFullPath = uploadedFile.path;

  if (!imageUrl) {
    return {
      success: false,
      error: "Failed to get image URL",
      status: 500,
    };
  }

  const { error } = await supabase
    .from("papers")
    .insert({
      brand,
      type,
      size,
      sheets,
      image_path: imageFullPath,
      image_url: imageUrl,
      price,
    })
    .select();

  if (error) {
    return {
      success: false,
      error: "Failed to create service",
      status: 500,
    };
  }

  return{ success: true };
}
