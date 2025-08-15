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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTransactionByUserId } from "@/features/get-transaction-by-user-id";
import { Button } from "../ui/button";
import {
  Ban,
  CircleCheck,
  CircleDashed,
  CircleDollarSign,
  ClockFading,
  History,
  QrCode,
} from "lucide-react";
import { formatIDR } from "@/utils/formatter/currency";
import {
  formatDateTime,
} from "@/utils/formatter/datetime";

const HistoryCard = async () => {
  const transactions = await getTransactionByUserId();
  return (
    <>
      {transactions.length > 0 ? (
        <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {transaction.service.name}
                </CardTitle>
                <CardDescription className="text-xs md:text-md">
                  {formatDateTime(transaction.created_at)}
                </CardDescription>
                {transaction.status === "Pending" ? (
                  <CardAction
                    className={
                      "bg-pending-background/20 text-pending-foreground flex items-center gap-1 rounded-md px-2 py-1.5"
                    }
                  >
                    <CircleDashed size={16} />
                    {transaction.status}
                  </CardAction>
                ) : transaction.status === "In Process" ? (
                  <CardAction
                    className={
                      "bg-foreground/20 text-foreground flex items-center gap-1 rounded-md px-2 py-1.5"
                    }
                  >
                    <ClockFading size={16} />
                    {transaction.status}
                  </CardAction>
                ) : (
                  <CardAction
                    className={
                      "bg-complete-background/20 text-complete-foreground flex items-center gap-1 rounded-md px-2 py-1.5"
                    }
                  >
                    <CircleCheck size={16} />
                    {transaction.status}
                  </CardAction>
                )}
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex justify-between text-sm md:text-md">
                  <p>Metode Pembayaran:</p>
                  <span className="flex items-center gap-1 font-semibold">
                    {transaction.payment_method === "Qris" ? (
                      <QrCode size={15} />
                    ) : (
                      <CircleDollarSign size={15} />
                    )}
                    {transaction.payment_method}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-md">
                  <p>Status Pembayaran:</p>
                  <span className={`flex items-center gap-1 font-semibold ${transaction.payment_status === "Pending" ? "text-pending-foreground" : "text-complete-foreground"}`}>
                    {transaction.payment_status === "Pending" ? (
                      <CircleDashed size={15} />
                    ) : (
                      <CircleCheck size={15} />
                    )}
                    {transaction.payment_status}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-md border-b">
                  <p>Harga Perlembar:</p>
                  <span className="font-semibold">
                    {formatIDR(transaction.service?.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-md font-semibold">
                  <p>Total Harga:</p>
                  <span className="font-semibold">
                    {formatIDR(transaction.total_price)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm md:text-md">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Detail</Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <div className="mx-auto mb-2 flex justify-center text-center">
                      <h2 className="font-semibold">Detail Transaksi</h2>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm md:text-md border-b">
                        <p>Ukuran Kertas:</p>
                        <span className="font-semibold">
                          {transaction.service.paper?.size}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-md border-b">
                        <p>Jumlah Halaman:</p>
                        <span className="font-semibold">
                          {transaction.pages}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-md border-b">
                        <p>Jumlah Kertas:</p>
                        <span className="font-semibold">
                          {transaction.sheets}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-md border-b">
                        <p>Berwarna:</p>
                        <span className="font-semibold">
                          {transaction.service.color ? (
                            <CircleCheck size={16} />
                          ) : (
                            <Ban className="text-destructive" size={16} />
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-md border-b">
                        <p>Bolak Balik:</p>
                        <span className="font-semibold">
                          {transaction.service.duplex ? (
                            <CircleCheck size={16} />
                          ) : (
                            <Ban className="text-destructive" size={16} />
                          )}
                        </span>
                      </div>
                      <div
                        className={`${!transaction.notes ? "justify-between" : ""} flex flex-col text-sm md:text-md`}
                      >
                        <span>Catatan:</span>
                        {transaction.notes ? (
                          <div className="h-24 overflow-y-auto rounded-md border px-3 py-1">
                            <p>{transaction.notes}</p>
                          </div>
                        ) : (
                          <Ban className="text-destructive" size={16} />
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {transaction.payment_status === "Pending" ? (
                  <Button>Bayar Sekarang</Button>
                ) : (
                  <h2 className="font-semibold">Pesanan Selesai</h2>
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
