"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export const updateTransactionStatus = async (
  transactionId: string,
  transactionStatus: string,
) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (
    authError ||
    !user ||
    user.user_metadata.role !== "admin"
  ) {
    return { error: "Authentication failed", status: 401 };
  }

  const allowedStatus = [
    "Pending",
    "In Process",
    "Printed",
    "Delivering",
    "Delivered",
    "Completed",
  ];
  if (!allowedStatus.includes(transactionStatus)) {
    return { error: "Invalid transaction status", status: 400 };
  }

  try {
    const { error } = await supabase
      .from("transactions")
      .update({ status: transactionStatus, updated_at: new Date() })
      .eq("id", transactionId)
      .single();

    if (error) {
      return { error: error.message, status: 500 };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating transaction:", error);
    return {
      success: false,
      error: "Failed to update transaction",
      status: 500,
    };
  }
};
