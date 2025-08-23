import React, { useState } from "react";
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
import {
  Ban,
  CircleCheck,
  CircleDashed,
  CircleDollarSign,
  ClockFading,
  FileInput,
  Loader2,
  Mail,
  NotepadText,
  Phone,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  formatDateShortStriped,
  formatTime24,
} from "@/utils/formatter/datetime";
import { Transaction } from "@/features/get-all-transaction-realtime";
import { formatIDR } from "@/utils/formatter/currency";
import axios from "axios";
import { toast } from "sonner";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await axios.patch(`/api/transactions/update/status`, {
        id: transaction.id,
        status: newStatus,
      });
      toast.success("Transaction status updated successfully");
    } catch (err) {
      toast.error("Failed to update transaction status");
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Card className="w-fit max-w-md transition-all">
        <CardHeader>
          <CardTitle>{transaction.service.name}</CardTitle>
          <CardAction>
            <div
              className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-center text-sm font-semibold ${
                transaction.payment_status === "Pending"
                  ? "bg-pending-background dark:bg-pending-background/40 text-pending-foreground"
                  : "bg-complete-background dark:bg-complete-background/40 text-complete-foreground"
              }`}
            >
              {transaction.payment_status === "Pending" ? (
                <CircleDashed size={16} />
              ) : (
                <CircleCheck size={16} />
              )}
              {transaction.payment_status}
            </div>
          </CardAction>
          <CardDescription className="">
            <Popover>
              <PopoverTrigger asChild>
                <p className="flex cursor-pointer items-center gap-1 font-semibold">
                  {
                    <Image
                      alt="User Avatar"
                      width={18}
                      height={18}
                      className="rounded-full"
                      src={
                        transaction.profile.avatar_url || "/default_avatar.svg"
                      }
                    />
                  }{" "}
                  {transaction.profile.full_name.length > 15
                    ? transaction.profile.full_name.slice(0, 15) + "..."
                    : transaction.profile.full_name}
                </p>
              </PopoverTrigger>
              <PopoverContent className="flex w-full flex-row gap-4">
                <div className="flex items-center">
                  <Image
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                    src={
                      transaction.profile.avatar_url || "/default_avatar.svg"
                    }
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <Mail size={16} />
                    <Link
                      href={`mailto:${transaction.profile.email}`}
                      className="hover:underline"
                    >
                      {transaction.profile.email}
                    </Link>
                  </div>
                  {transaction.profile.phone && (
                    <div className="flex items-center gap-2 text-center">
                      <Phone size={16} />
                      <Link
                        href={`https://wa.me/${transaction.profile.phone}`}
                        className="hover:underline"
                      >
                        {transaction.profile.phone}
                      </Link>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Paper Size</span>
            <p className="text-end font-semibold">
              {transaction.service.paper?.size}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Pages</span>
            <p className="place-items-end text-end font-semibold">
              {transaction.pages}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Sheets</span>
            <p className="place-items-end text-end font-semibold">
              {transaction.sheets}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Color</span>
            <p className="flex items-center justify-end font-semibold">
              {transaction.service.color ? (
                <CircleCheck size={16} className="text-complete-foreground" />
              ) : (
                <Ban className="text-destructive" size={16} />
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Duplex</span>
            <p className="flex items-center justify-end font-semibold">
              {transaction.service.duplex ? (
                <CircleCheck size={16} className="text-complete-foreground" />
              ) : (
                <Ban className="text-destructive" size={16} />
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Needed at</span>
            <p className="place-items-end text-end font-semibold">
              {formatDateShortStriped(transaction.needed_date)} -{" "}
              {formatTime24(transaction.needed_time)}
            </p>
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Payment Method</span>
            {transaction.payment_method === "Qris" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <p className="flex cursor-pointer items-center justify-end gap-1 text-end font-semibold">
                    <QrCode size={15} className="animate-pulse" /> QRIS
                  </p>
                </PopoverTrigger>
                <PopoverContent side="top">
                  <Image
                    src={transaction.receipt_url}
                    alt="Receipt"
                    width={300}
                    height={500}
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <p className="flex items-center justify-end gap-1 text-end font-semibold">
                <CircleDollarSign size={15} /> Cash
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 border-b pt-2">
            <span className="text-start">Customer</span>
            <p className="place-items-end text-end font-semibold">
              {formatIDR(transaction.service.price)}
            </p>
          </div>
          <div className="grid grid-cols-2 pt-2">
            <span className="font-semibold">Total Price</span>
            <p className="place-items-end text-end font-semibold">
              {formatIDR(transaction.total_price)}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid w-full grid-cols-2">
            <div className="flex gap-2">
              {transaction.notes && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="animate-pulse">
                      <NotepadText size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top">
                    <span className="font-semibold">Notes</span>
                    <div className="overflow-y-auto rounded-md">
                      <p>{transaction.notes}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <Link
                title="Go to File"
                href={transaction.file_url}
                target="_blank"
              >
                <Button variant="outline">
                  <FileInput />
                </Button>
              </Link>
            </div>
            <div className="justify-self-end">
              {transaction.status === "Pending" ? (
                <Button
                  onClick={() => updateStatus("In Process")}
                  disabled={loading}
                  variant="default"
                  className={`bg-destructive hover:bg-destructive/80 w-full ${loading ? "cursor-wait" : "cursor-pointer"}`}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CircleDashed /> Pending
                    </>
                  )}
                </Button>
              ) : transaction.status === "In Process" ? (
                <Button
                  onClick={() => updateStatus("Completed")}
                  disabled={loading}
                  variant="default"
                  className={`w-full cursor-pointer ${loading ? "cursor-wait" : "cursor-pointer"}`}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ClockFading /> In Process
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default TransactionCard;
