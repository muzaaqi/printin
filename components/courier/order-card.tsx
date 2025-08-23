import {
  Card,
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
import { Button } from "../ui/button";
import {
  Ban,
  CircleCheck,
  CircleDashed,
  CircleDollarSign,
  QrCode,
} from "lucide-react";
import { formatIDR } from "@/utils/formatter/currency";
import {
  formatDateShortStriped,
  formatTime24,
} from "@/utils/formatter/datetime";
import Image from "next/image";
import Link from "next/link";


import React from 'react'
import StatusButton from "./status-button";

const OrderCard = ({transaction} : {transaction: GetTransactionByCourierId}) => {
  return (
    <Card key={transaction.id}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">
          <div className="line-clamp-1 flex items-center gap-2 font-semibold">
            <Image
              src={transaction.profile.avatar_url || "./default_avatar.svg"}
              alt={transaction.profile.full_name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <h2>
                {transaction.profile?.full_name.length > 24
                  ? `${transaction.profile?.full_name.slice(0, 24)}...`
                  : transaction.profile?.full_name}
              </h2>
              {/* <Phone size={16} /> */}
              <Link
                href={`https://wa.me/${transaction.profile?.phone}`}
                className="text-muted-foreground text-xs hover:underline"
              >
                {transaction.profile?.phone}
              </Link>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="md:text-md text-xs"></CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <div className="md:text-md flex justify-between text-sm">
          <p>Layanan:</p>
          <span className="flex items-center gap-1 font-semibold">
            {transaction.service.name}
          </span>
        </div>
        <div className="md:text-md flex justify-between text-sm">
          <p>Dibutuhkan:</p>
          <span className="flex items-center gap-2 font-semibold">
            {formatDateShortStriped(transaction.needed_date)}
            <p className="bg-accent-foreground text-accent items-center justify-center rounded-sm px-1.5 py-0.5 text-center">
              {formatTime24(transaction.needed_time)}
            </p>
          </span>
        </div>
        <div className="md:text-md flex justify-between text-sm">
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
        <div className="md:text-md flex justify-between text-sm">
          <p>Status Pembayaran:</p>
          <span
            className={`flex items-center gap-1 font-semibold ${transaction.payment_status === "Pending" ? "text-pending-foreground" : "text-complete-foreground"}`}
          >
            {transaction.payment_status === "Pending" ? (
              <CircleDashed size={15} />
            ) : (
              <CircleCheck size={15} />
            )}
            {transaction.payment_status}
          </span>
        </div>
        <div className="md:text-md flex justify-between border-b text-sm">
          <p>Harga Perlembar:</p>
          <span className="font-semibold">
            {formatIDR(transaction.service?.price)}
          </span>
        </div>
        <div className="md:text-md flex justify-between text-sm font-semibold">
          <p>Total Harga:</p>
          <span className="font-semibold">
            {formatIDR(transaction.total_price)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="md:text-md flex justify-between text-sm">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Detail</Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div className="mx-auto mb-2 flex justify-center text-center">
              <h2 className="font-semibold">Detail Transaksi</h2>
            </div>
            <div className="space-y-1">
              <div className="md:text-md flex justify-between border-b text-sm">
                <p>Ukuran Kertas:</p>
                <span className="font-semibold">
                  {transaction.service.paper?.size}
                </span>
              </div>
              <div className="md:text-md flex justify-between border-b text-sm">
                <p>Jumlah Halaman:</p>
                <span className="font-semibold">{transaction.pages}</span>
              </div>
              <div className="md:text-md flex justify-between border-b text-sm">
                <p>Jumlah Kertas:</p>
                <span className="font-semibold">{transaction.sheets}</span>
              </div>
              <div className="md:text-md flex justify-between border-b text-sm">
                <p>Berwarna:</p>
                <span className="font-semibold">
                  {transaction.service.color ? (
                    <CircleCheck size={16} />
                  ) : (
                    <Ban className="text-destructive" size={16} />
                  )}
                </span>
              </div>
              <div className="md:text-md flex justify-between border-b text-sm">
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
                className={`${!transaction.notes ? "justify-between" : ""} md:text-md flex flex-col text-sm`}
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
        <StatusButton transaction={transaction} />
      </CardFooter>
    </Card>
  );
}

export default OrderCard
