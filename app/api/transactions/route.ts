import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client"; // sesuaikan util Anda

// Mapping kombinasi opsi ke key harga di kolom JSON prices
const priceKeyMap: Record<string, string> = {
  "Hitam-Putih|Satu-Sisi": "priceSingleSide",
  "Hitam-Putih|Dua-Sisi": "priceDoubleSides",
  "Berwarna|Satu-Sisi": "priceColorSingleSide",
  "Berwarna|Dua-Sisi": "priceColorDoubleSides",
};

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const serviceId = form.get("serviceId") as string;
    const color = form.get("color") as string;
    const side = form.get("side") as string;
    const pages = Number(form.get("pages"));
    const sheets = Number(form.get("sheets"));
    const neededAt = form.get("neededAt") as string | null;
    const notes = (form.get("notes") as string) || "";
    const paymentMethod = form.get("paymentMethod") as "Cash" | "Qris";
    const file = form.get("file") as File | null;
    const receipt = form.get("receipt") as File | null;

    if (!serviceId || !file || !pages)
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );

    // Ambil service
    const { data: serviceRow, error: serviceErr } = await supabase
      .from("services")
      .select("id, remainingStock, prices")
      .eq("id", serviceId)
      .single();

    if (serviceErr || !serviceRow)
      return NextResponse.json(
        { error: "Service tidak ditemukan" },
        { status: 404 }
      );

    if (pages < 1)
      return NextResponse.json({ error: "Pages minimal 1" }, { status: 400 });
    if (pages > serviceRow.remainingStock)
      return NextResponse.json(
        { error: "Pages melebihi stok" },
        { status: 400 }
      );

    // Hitung harga
    const key = priceKeyMap[`${color}|${side}`];
    if (!key)
      return NextResponse.json(
        { error: "Kombinasi harga tidak valid" },
        { status: 400 }
      );

    const basePrice = Number(serviceRow.prices?.[key]) || 0;
    const totalPrice = basePrice * pages;

    // Upload file dokumen
    const docPath = `${user.id}/${user.user_metadata.full_name}-${color}-${side}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("transactions-files")
      .upload(docPath, file, { upsert: false });
    if (upErr)
      return NextResponse.json({ error: "Gagal upload file" }, { status: 500 });

    const fileUrl = supabase.storage.from("transactions-files").getPublicUrl(docPath)
      .data.publicUrl;

    // Upload bukti (opsional)
    let receiptUrl: string | null = null;
    if (paymentMethod === "Qris" && receipt) {
      const rPath = `${user.id}/${user.user_metadata.full_name}-${receipt.name}-${crypto.randomUUID()}`;
      const { error: rErr } = await supabase.storage
        .from("transactions-receipts")
        .upload(rPath, receipt, { upsert: false });
      if (rErr)
        return NextResponse.json(
          { error: "Gagal upload bukti" },
          { status: 500 }
        );
      receiptUrl = supabase.storage.from("transactions-receipts").getPublicUrl(rPath)
        .data.publicUrl;
    }

    // Insert transaksi
    const { data: inserted, error: insErr } = await supabase
      .from("transactions")
      .insert({
        userId: user.id,
        serviceId,
        fileUrl,
        color,
        side,
        pages,
        sheets,
        neededAt,
        notes,
        paymentMethod,
        receiptUrl,
        totalPrice,
        process: "Pending",
        paymentStatus: paymentMethod === "Qris" ? "Paid" : "Pending",
      });

    if (insErr)
      return NextResponse.json(
        { error: "Gagal simpan transaksi" },
        { status: 500 }
      );

    // Update stok (sederhana)
    await supabase
      .from("services")
      .update({ remainingStock: serviceRow.remainingStock - sheets })
      .eq("id", serviceId);

    return NextResponse.json(
      { success: true, data: inserted },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message || "Server error"
        : typeof error === "string"
        ? error
        : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
