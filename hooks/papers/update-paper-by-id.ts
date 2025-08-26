"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { UpdatePaperFormData } from "./type";

export const updatePaperById = async (formData: UpdatePaperFormData) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return { error: "Authentication failed", status: 401, success: false};
  }

  const { id, sheets, brand, size, type, price, image } = formData;

  if (typeof sheets !== "number" || sheets < 0) {
    return { error: "Invalid sheets value", status: 400, success: false};
  }

  const { data: selectData, error: selectError } = await supabase
    .from("papers")
    .select("*")
    .eq("id", id)
    .single();

  if (selectError) {
    console.error("Error fetching paper:", selectError);
    return { error: "Failed to fetch paper", status: 500, success: false};
  }

  let imageUrl = selectData.image_url;
  let imageFullPath = selectData.image_path;

  if (image) {
    const { error: storageError } = await supabase.storage
      .from("ngeprint-assets")
      .remove([selectData.image_path]);

    if (storageError) {
      return { error: storageError.message, status: 500, success: false};
    }
    
    const safeBrand = brand ? brand.replace(/\s+/g, "_") : selectData.brand.replace(/\s+/g, "_");
    const fileExt = image.name.split(".").pop();
    const imagePath = `Papers/${safeBrand}/${size}/PAPER-${type}.${fileExt}`;

    const { data: uploadedFile, error: uploadError } = await supabase.storage
      .from("ngeprint-assets")
      .upload(imagePath, image, {
        upsert: false,
        contentType: image.type,
      });

    if (uploadError) {
      return { error: "Failed to upload image", status: 500, success: false};
    }

    try {
      imageUrl = supabase.storage
        .from("ngeprint-assets")
        .getPublicUrl(imagePath).data.publicUrl;

      imageFullPath = uploadedFile.path;
    } catch (error) {
      return { error: "Failed to get image URL", status: 500, success: false, message: error };
    }
  }

  const { error } = await supabase
    .from("papers")
    .update({
      sheets: sheets || selectData.sheets,
      brand: brand || selectData.brand,
      size: size || selectData.size,
      type: type || selectData.type,
      image_path: imageFullPath,
      image_url: imageUrl,
      price: price || selectData.price,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select();

  if (error) {
    return { error: "Failed to update paper", status: 500, success: false};
  }

  return { success: true };
};
