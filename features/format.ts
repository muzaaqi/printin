// ...existing code...
export type DateInput = string | number | Date;



export const formatIDR = (n: number | null) =>
  n == null ? "-" : `Rp ${n.toLocaleString("id-ID")}`;

// Helper untuk merakit tanggal + waktu lokal tanpa Z
export function joinLocalDateTime(
  datePart: string, // "YYYY-MM-DD"
  timePart: string, // "HH:mm" atau "HH:mm:ss"
): string {
  const time =
    timePart.length === 5 ? `${timePart}:00` : timePart || "00:00:00";
  return `${datePart}T${time}`; // atau pakai spasi: `${datePart} ${time}`
}
