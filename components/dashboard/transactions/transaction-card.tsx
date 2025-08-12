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
import { Transaction } from "@/features/get-all-transaction-realtime";
import {
  Ban,
  CircleCheck,
  CircleDashed,
  CircleDollarSign,
  ClockFading,
  FileInput,
  Mail,
  Phone,
  QrCode,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  formatDateShortStriped,
  formatDateTime,
  formatTime24,
} from "@/utils/formatter/datetime";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const formatIDR = (n: number | null) =>
    n == null ? "-" : `Rp ${n.toLocaleString("id-ID")}`;
  return (
    <>
      <Card className="w-fit max-w-md">
        <CardHeader>
          <CardTitle>{transaction.services.name}</CardTitle>
          <CardAction>
            <div
              className={`flex items-center gap-1 text-center text-sm font-semibold ${
                transaction.paymentStatus === "Pending"
                  ? "bg-pending-background dark:bg-pending-background/40 text-pending-foreground rounded-md px-2 py-1"
                  : "bg-complete-background dark:bg-complete-background/40 text-complete-foreground rounded-md px-2 py-1"
              }`}
            >
              {transaction.paymentStatus === "Pending" ? (
                <CircleDashed size={16} />
              ) : (
                <CircleCheck size={16} />
              )}
              {transaction.paymentStatus}
            </div>
          </CardAction>
          <CardDescription>
            {formatDateTime(transaction.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Ukuran Kertas:</span>
            <p className="text-end font-semibold">
              {transaction.services.papers?.size}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Jumlah Halaman:</span>
            <p className="place-items-end text-end font-semibold">
              {transaction.pages}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Jumlah Kertas:</span>
            <p className="place-items-end text-end font-semibold">
              {transaction.sheets}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Berwarna:</span>
            <p className="flex items-center justify-end font-semibold">
              {transaction.services.color ? (
                <CircleCheck size={16} className="text-complete-foreground" />
              ) : (
                <Ban className="text-destructive" size={16} />
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Bolak Balik:</span>
            <p className="flex items-center justify-end font-semibold">
              {transaction.services.duplex ? (
                <CircleCheck size={16} className="text-complete-foreground" />
              ) : (
                <Ban className="text-destructive" size={16} />
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Dibutuhkan:</span>
            <p className="place-items-end text-end font-semibold">
              {formatDateShortStriped(transaction.neededDate)} -{" "}
              {formatTime24(transaction.neededTime)}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Metode Pembayaran:</span>
            <p className="flex items-center justify-end gap-1 text-end font-semibold">
              {transaction.paymentMethod === "Qris" ? (
                <QrCode size={15} />
              ) : (
                <CircleDollarSign size={15} />
              )}{" "}
              {transaction.paymentMethod}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Customer:</span>
            <p className="flex items-center justify-end gap-1 text-end font-semibold">
              {
                <Image
                  alt="User Avatar"
                  width={16}
                  height={16}
                  className="rounded-full"
                  src={transaction.userAvatar || "/default_avatar.svg"}
                />
              }{" "}
              {transaction.userName.length > 15
                ? transaction.userName.slice(0, 15) + "..."
                : transaction.userName}
            </p>
          </div>
          <div className="pt-2">
            <span>Notes</span>
            <div className="h-24 overflow-y-auto rounded-md border px-3 py-1">
              <p>{transaction.notes}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 pt-2">
            <span>Total Harga:</span>
            <p className="place-items-end text-end font-semibold">
              {formatIDR(transaction.totalPrice)}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid w-full grid-cols-2 gap-10">
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" className="hover:underline">
                    <Phone size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="flex w-full flex-row gap-4"
                >
                  <div className="flex items-center">
                    <Image
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                      src={transaction.userAvatar || "/default_avatar.svg"}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-center">
                      <Mail size={16} />
                      <span>{transaction.userEmail}</span>
                    </div>
                    {transaction.userPhone && (
                      <div className="flex items-center gap-2 text-center">
                        <Phone size={16} />
                        <span>{transaction.userPhone}</span>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {transaction.receiptUrl && (
                <Popover>
                  <PopoverTrigger>
                    <Button variant="outline" className="hover:underline">
                      <Receipt size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top">
                    <Image
                      src={transaction.receiptUrl}
                      alt="Receipt"
                      width={300}
                      height={500}
                      className="rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              )}
              <Link href={transaction.fileUrl} target="_blank">
                <Button variant="outline">
                  <FileInput />
                </Button>
              </Link>
            </div>
            {transaction.status === "Pending" ? (
              <Button
                variant="default"
                className="bg-destructive hover:bg-destructive/80"
              >
                <CircleDashed /> Pending
              </Button>
            ) : transaction.status === "In Process" ? (
              <Button variant="default">
                <ClockFading /> In Process
              </Button>
            ) : transaction.status === "Completed" ? (
              <Button disabled variant="secondary">
                <CircleCheck /> Completed
              </Button>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default TransactionCard;
