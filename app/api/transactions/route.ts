import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client"; // sesuaikan util Anda

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
    const paperId = form.get("paperId") as string;
    const pages = Number(form.get("pages"));
    const sheets = Number(form.get("sheets"));
    const neededAt = form.get("neededAt") as string | null;
    const notes = (form.get("notes") as string) || "";
    const price = Number(form.get("price")) || 0;
    const paymentMethod = form.get("paymentMethod") as "Cash" | "Qris";
    const file = form.get("file") as File | null;
    const receipt = form.get("receipt") as File | null;

    if (!paperId || !file || !pages)
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );

    // Ambil papers
    const { data: papersRow, error: papersErr } = await supabase
      .from("papers")
      .select("id, sheets")
      .eq("id", paperId)
      .single();

    if (papersErr || !papersRow)
      return NextResponse.json(
        { error: "Papers tidak ditemukan" },
        { status: 404 }
      );

    if (pages < 1)
      return NextResponse.json({ error: "Pages minimal 1" }, { status: 400 });
    if (pages > papersRow.sheets)
      return NextResponse.json(
        { error: "Pages melebihi stok" },
        { status: 400 }
      );

    const basePrice = Number(price) || 0;
    const totalPrice = basePrice * sheets;

    // Upload file dokumen
    const docPath = `${user.id}/${user.user_metadata.full_name}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("transactions-files")
      .upload(docPath, file, { upsert: false });
    if (upErr)
      return NextResponse.json({ error: "Gagal upload file" }, { status: 500 });

    const fileUrl = supabase.storage
      .from("transactions-files")
      .getPublicUrl(docPath).data.publicUrl;

    // Upload bukti (opsional)
    let receiptUrl: string | null = null;
    if (paymentMethod === "Qris" && receipt) {
      const rPath = `${user.id}/${user.user_metadata.full_name}-${
        receipt.name
      }-${crypto.randomUUID()}`;
      const { error: rErr } = await supabase.storage
        .from("transactions-receipts")
        .upload(rPath, receipt, { upsert: false });
      if (rErr)
        return NextResponse.json(
          { error: "Gagal upload bukti" },
          { status: 500 }
        );
      receiptUrl = supabase.storage
        .from("transactions-receipts")
        .getPublicUrl(rPath).data.publicUrl;
    }

    // Insert transaksi
    const { data: inserted, error: insErr } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        service_id: serviceId,
        paper_id: paperId,
        file_url: fileUrl,
        pages,
        sheets,
        needed_at: neededAt,
        notes,
        payment_method: paymentMethod,
        receipt_url: receiptUrl,
        total_price: totalPrice,
        status: "Pending",
        payment_status: paymentMethod === "Qris" ? "Paid" : "Pending",
      });

    if (insErr)
      return NextResponse.json(
        { error: "Gagal simpan transaksi" },
        { status: 500 }
      );

    await supabase
      .from("papers")
      .update({ sheets: papersRow.sheets - sheets })
      .eq("id", paperId);

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
