import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { uploadToR2 } from "@/features/upload-to-r2";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// Tambahkan config untuk Next.js 15
export const runtime = "nodejs";
export const maxDuration = 30; // 30 seconds timeout

export async function POST(req: NextRequest) {
  let supabase;

  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 60 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File terlalu besar (maksimal 60MB)" },
        { status: 413 },
      );
    }

    supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      );
    }

    let form: FormData;
    try {
      form = await Promise.race([
        req.formData(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("FormData parsing timeout")),
            15000,
          ),
        ),
      ]);
    } catch (parseError) {
      console.error("FormData parsing error:", parseError);
      return NextResponse.json(
        { error: "Gagal memproses data form" },
        { status: 400 },
      );
    }

    const serviceId = form.get("serviceId") as string;
    const courierId = form.get("courier") as string | null;
    const paperId = form.get("paperId") as string;
    const pages = Number(form.get("pages"));
    const sheets = Number(form.get("sheets"));
    const neededDate = form.get("neededDate") as string | null;
    const neededTime = form.get("neededTime") as string | null;
    const notes = (form.get("notes") as string) || "";
    const price = Number(form.get("price")) || 0;
    const paymentMethod = form.get("paymentMethod") as "Cash" | "Qris";
    const file = form.get("file") as File | null;
    const receipt = form.get("receipt") as File | null;

    if (!serviceId || !paperId || !file || !pages) {
      return NextResponse.json(
        {
          error:
            "Data tidak lengkap: serviceId, paperId, file, dan pages wajib diisi",
        },
        { status: 400 },
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File terlalu besar (maksimal 50MB)" },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung" },
        { status: 400 },
      );
    }

    if (isNaN(pages) || pages < 1 || pages > 1000) {
      return NextResponse.json(
        { error: "Jumlah halaman harus antara 1-1000" },
        { status: 400 },
      );
    }

    if (isNaN(sheets) || sheets < 1) {
      return NextResponse.json(
        { error: "Jumlah lembar tidak valid" },
        { status: 400 },
      );
    }

    const { data: papersRow, error: papersErr } = await supabase
      .from("papers")
      .select("id, sheets")
      .eq("id", paperId)
      .single();

    if (papersErr) {
      console.error("Papers query error:", papersErr);
      return NextResponse.json(
        { error: "Gagal mengambil data kertas" },
        { status: 500 },
      );
    }

    if (!papersRow) {
      return NextResponse.json(
        { error: "Kertas tidak ditemukan" },
        { status: 404 },
      );
    }

    if (sheets > papersRow.sheets) {
      return NextResponse.json(
        { error: `Stok tidak cukup. Tersedia: ${papersRow.sheets} lembar` },
        { status: 400 },
      );
    }

    const totalPrice = (Number(price) || 0) * sheets;

    if (neededDate && neededTime) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;

      if (!dateRegex.test(neededDate)) {
        return NextResponse.json(
          { error: "Format tanggal harus YYYY-MM-DD" },
          { status: 400 },
        );
      }

      if (!timeRegex.test(neededTime)) {
        return NextResponse.json(
          { error: "Format waktu harus HH:MM atau HH:MM:SS" },
          { status: 400 },
        );
      }
    }

    const timestamp = Date.now();
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toUpperCase();
    const transactionId = `ORDER-${timestamp}-${sanitizedFileName}`;
    const docPath = `${user.id}-${user.user_metadata.full_name}/${transactionId}/FILE-${timestamp}-${sanitizedFileName}`;

    // const { error: upErr } = await supabase.storage
    //   .from("transactions-files")
    //   .upload(docPath, file, {
    //     upsert: false,
    //     contentType: file.type,
    //   });

    // if (upErr) {
    //   console.error("File upload error:", upErr);
    //   return NextResponse.json(
    //     { error: "Gagal mengupload file dokumen" },
    //     { status: 500 },
    //   );
    // }

    // const fileUrl = supabase.storage
    //   .from("transactions-files")
    //   .getPublicUrl(docPath).data.publicUrl;

    // // Upload receipt if needed
    // let receiptUrl: string | null = null;
    // if (paymentMethod === "Qris" && receipt) {
    //   if (receipt.size > 5 * 1024 * 1024) {
    //     // 5MB for receipts
    //     return NextResponse.json(
    //       { error: "Bukti pembayaran terlalu besar (maksimal 5MB)" },
    //       { status: 400 },
    //     );
    //   }

    //   const sanitizedReceiptName = receipt.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    //   const rPath = `${user.id}/${timestamp}-receipt-${sanitizedReceiptName}`;

    //   const { error: rErr } = await supabase.storage
    //     .from("transactions-receipts")
    //     .upload(rPath, receipt, {
    //       upsert: false,
    //       contentType: receipt.type,
    //     });

    //   if (rErr) {
    //     console.error("Receipt upload error:", rErr);
    //     // Delete uploaded document if receipt fails
    //     await supabase.storage.from("transactions-files").remove([docPath]);
    //     return NextResponse.json(
    //       { error: "Gagal mengupload bukti pembayaran" },
    //       { status: 500 },
    //     );
    //   }

    //   receiptUrl = supabase.storage
    //     .from("transactions-receipts")
    //     .getPublicUrl(rPath).data.publicUrl;
    // }

    const bucketName = "ngeprint-file-storage";

    let fileUrl: string;

    try {
      fileUrl = await uploadToR2(docPath, file);
    } catch (err) {
      console.error("File upload error:", err);
      return NextResponse.json(
        { error: "Gagal mengupload file dokumen" },
        { status: 500 },
      );
    }

    let receiptUrl: string | null = null;
    if (paymentMethod === "Qris" && receipt) {
      if (receipt.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Bukti pembayaran terlalu besar (maksimal 5MB)" },
          { status: 400 },
        );
      }

      try {
        const rPath = `${user.id}-${user.user_metadata.full_name}/${transactionId}/RECEIPT-${timestamp}-${sanitizedFileName}`;
        receiptUrl = await uploadToR2(rPath, receipt);
      } catch (err) {
        console.error("Receipt upload error:", err);

        await r2.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: docPath,
          }),
        );

        return NextResponse.json(
          { error: "Gagal mengupload bukti pembayaran" },
          { status: 500 },
        );
      }
    }

    const insertData = {
      id: transactionId,
      user_id: user.id,
      service_id: serviceId,
      paper_id: paperId,
      courier_id: courierId || null,
      file_url: fileUrl,
      pages,
      sheets,
      needed_date: neededDate,
      needed_time: neededTime,
      notes: notes.substring(0, 150),
      payment_method: paymentMethod,
      receipt_url: receiptUrl,
      total_price: totalPrice,
      status: "Pending",
      payment_status: paymentMethod === "Qris" ? "Paid" : "Pending",
    };

    const { data: inserted, error: insErr } = await supabase
      .from("transactions")
      .insert(insertData)
      .select()
      .single();

    if (insErr) {
      console.error("Transaction insert error:", insErr);

      await supabase.storage.from("transactions-files").remove([docPath]);
      if (receiptUrl) {
        const receiptPath = receiptUrl.split("/").pop();
        if (receiptPath) {
          await supabase.storage
            .from("transactions-receipts")
            .remove([receiptPath]);
        }
      }

      return NextResponse.json(
        { error: "Gagal menyimpan transaksi ke database" },
        { status: 500 },
      );
    }

    const { error: stockErr } = await supabase
      .from("papers")
      .update({ sheets: papersRow.sheets - sheets })
      .eq("id", paperId);

    if (stockErr) {
      console.error("Stock update error:", stockErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: inserted,
        message: "Transaksi berhasil disimpan",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("API Route Error:", error);

    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan server";

    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 },
    );
  }
}
