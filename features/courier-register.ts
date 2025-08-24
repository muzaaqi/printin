"use server"

import { CourierRegisterSchema } from "@/lib/schema/courier-register"
import { createSupabaseServerClient } from "@/utils/supabase/server-client"

export const handleCourierRegister = async (userId: string, data: CourierRegisterSchema) => {

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("courier-requests")
    .insert({
      user_id: userId,
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      area: data.area,
    })

  if (error) {
    return { success: false, error }
  }

  return { success: true }
}