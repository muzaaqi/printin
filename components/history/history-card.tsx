import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTransactionByUserId } from "@/features/get-transaction-by-user-id";
import { Button } from "../ui/button";
import { History } from "lucide-react";

const HistoryCard = async () => {
  const transactions = await getTransactionByUserId();

  const formatIDR = (n: number | null) =>
    n == null ? "-" : `Rp ${n.toLocaleString("id-ID")}`;

  const formatDate = (iso?: string) => {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Unknown";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <>
      {transactions.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {transaction.services.name}
                </CardTitle>
                <CardDescription>
                  {formatDate(transaction.created_at)}
                </CardDescription>
                <CardAction
                  className={`${
                    transaction.payment_status === "Pending"
                      ? "text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md"
                      : "text-green-500 bg-green-50 px-2 py-1 rounded-md"
                  }`}
                >
                  {transaction.payment_status}
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <p className="font-semibold">Ukuran Kertas:</p>
                  <p>{transaction.services.papers?.size}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Jumlah Halaman:</p>
                  <p>{transaction.pages}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Jumlah Kertas:</p>
                  <p>{transaction.sheets}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Warna:</p>
                  <p>{transaction.services.color}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Sisi:</p>
                  <p>{transaction.services.duplex}</p>
                </div>
                <div className="flex justify-between border-b">
                  <p className="font-semibold">Metode Pembayaran:</p>
                  <p>{transaction.payment_method}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Total Harga:</p>
                  <p>{formatIDR(transaction.total_price)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Detail</Button>
                {transaction.payment_status === "Pending" ? (
                  <Button>Bayar Sekarang</Button>
                ) : (
                  <h2>Pesanan Selesai</h2>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mx-auto min-h-screen flex flex-col place-items-center justify-center">
          <History className="h-12 w-12 text-muted-foreground -translate-y-35" />
          <p className="-translate-y-35">Tidak ada riwayat transaksi</p>
          <Button variant="outline" className="-translate-y-30">Lihat Layanan</Button>
        </div>
      )}
    </>
  );
};

export default HistoryCard;
