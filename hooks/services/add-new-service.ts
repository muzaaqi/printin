"use server"

import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { InsertServiceFormData } from "./types";

export const addNewService = async (formData: InsertServiceFormData) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.user_metadata.role !== "admin") {
    return {
      error: "Authentication failed",
      status: 401,
    };
  }

  const name = formData.name;
  const paperId = formData.paperId;
  const color = formData.color === "true";
  const duplex = formData.duplex === "true";
  const image = formData.image as File
  const price = formData.price;

  if (!price || isNaN(price) || price < 0) {
    return { success: false, error: "Invalid price value", status: 400 };
  }

  if (!image) {
    return { success: false, error: "Image file required", status: 400 };
  }

  const fileExt = image.name.split(".").pop();
  const safeName = name && name.replace(/\s+/g, "_");
  const imagePath = `Services/SERVICE-${safeName}.${fileExt}`;

  const { data: uploadedFile, error: uploadError } = await supabase.storage
    .from("ngeprint-assets")
    .upload(imagePath, image, {
      upsert: false,
      contentType: image.type,
    });

  console.log(uploadError)

  if (uploadError) {
    return { success: false, error: "Failed to upload image", status: 500 }
  }

  const imageUrl = supabase.storage
    .from("ngeprint-assets")
    .getPublicUrl(imagePath).data.publicUrl;

  const imageFullPath = uploadedFile.path;

  if (!imageUrl) {
    return {success: false, error: "Failed to get image URL", status: 500 }
  }

  const { error } = await supabase
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
    return { success: false, error: "Failed to create service", status: 500 };
  }

  return { success: true };
}
