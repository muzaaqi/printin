"use server"

import QRCode from "qrcode";

// 🔹 Fungsi CRC16 untuk validasi QRIS
function convertCRC16(str: string) {
  let crc = 0xffff;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  let hex = (crc & 0xffff).toString(16).toUpperCase();
  if (hex.length === 3) hex = "0" + hex;
  return hex;
}

// 🔹 API Handler
export const GenerateQRIS = async (transactionData: { amount: string; withFee: boolean; feeType: string; feeValue: string }) => {
  const qris =
    "00020101021126610014COM.GO-JEK.WWW01189360091436882423580210G6882423580303UMI51440014ID.CO.QRIS.WWW0215ID10253896847840303UMI5204581553033605802ID5906MUZONE6009PURWOREJO61055417262070703A0163041B5A";
  try {
    const { amount, withFee, feeType, feeValue } = transactionData;

    if (!qris || !amount) {
      return {
        status: "failed",
        error: "Field 'qris' dan 'amount' wajib diisi",
      };
    }

    // Hapus CRC lama
    const base = qris.slice(0, -4);

    // Ubah QRIS statis → dinamis
    const step1 = base.replace("010211", "010212");

    // Pecah di "5802ID"
    const [part1, part2] = step1.split("5802ID");

    // Tambahkan nominal (tag 54)
    let uang = `54${amount.length.toString().padStart(2, "0")}${amount}`;

    // Jika ada biaya layanan
    if (withFee) {
      if (feeType === "r") {
        uang += `55020256${feeValue.length.toString().padStart(2, "0")}${feeValue}`;
      } else if (feeType === "p") {
        uang += `55020357${feeValue.length.toString().padStart(2, "0")}${feeValue}`;
      }
    }

    // Tambahkan separator
    uang += "5802ID";

    // Satukan kembali
    let payload = part1 + uang + part2;

    // Hitung CRC
    payload += convertCRC16(payload);

    // Generate QR Code (base64)
    const qrImage = await QRCode.toDataURL(payload);

    return {
      status: "success",
      emv: payload,
      qrImage,
      error: null,
    };
  } catch (err: unknown) {
    return {
      status: "failed",
      emv: null,
      qrImage: null,
      error: (err as Error).message,
    };
  }
}
