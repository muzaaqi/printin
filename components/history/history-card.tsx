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
import { GetTransactionByUserId, getTransactionByUserId } from "@/features/get-transaction-by-user-id";
import { Button } from "../ui/button";
import { Ban, Check, History } from "lucide-react";
import { formatDateID, formatIDR } from "@/features/format";

const HistoryCard = async () => {
  const transactions = await getTransactionByUserId();
  return (
    <>
      {transactions.length > 0 ? (
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {transaction.services.name}
                </CardTitle>
                <CardDescription>
                  {formatDateID(transaction.created_at)}
                </CardDescription>
                <CardAction
                  className={`${
                    transaction.payment_status === "Pending"
                      ? "rounded-md bg-yellow-50 px-2 py-1 text-yellow-500"
                      : "rounded-md bg-green-50 px-2 py-1 text-green-500"
                  }`}
                >
                  {transaction.status}
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
                  <p className="font-semibold">Berwarna:</p>
                  <p>{transaction.services.color ? <Check size={16} /> : <Ban className="text-destructive" size={16} />}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Bolak Balik:</p>
                  <p>{transaction.services.duplex ? <Check size={16} /> : <Ban className="text-destructive" size={16} />}</p>
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
        <div className="mx-auto flex min-h-screen flex-col place-items-center justify-center">
          <History className="text-muted-foreground h-12 w-12 -translate-y-35" />
          <p className="-translate-y-35">Tidak ada riwayat transaksi</p>
          <Button variant="outline" className="-translate-y-30">
            Lihat Layanan
          </Button>
        </div>
      )}
    </>
  );
};

export default HistoryCard;
