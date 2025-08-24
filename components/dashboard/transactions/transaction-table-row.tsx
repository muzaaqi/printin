import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CircleCheck,
  CircleDashed,
  CircleDollarSignIcon,
  Mail,
  Phone,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/features/get-all-transaction-realtime";
import { formatDateOnly } from "@/utils/formatter/datetime";
import { toast } from "sonner";
import axios from "axios";
import { formatIDR } from "@/utils/formatter/currency";
import StatusButton from "@/components/status-button";

const TransactionTableRow = ({
  transaction,
  index,
}: {
  transaction: Transaction;
  index: number;
}) => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const res = await axios.patch(`/api/transactions/update/status`, {
        id,
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
    <TableRow key={transaction.id}>
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="">
        {
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex cursor-pointer flex-row gap-2 pr-5">
                <Image
                  src={
                    transaction.profile.avatar_url
                      ? transaction.profile.avatar_url
                      : "/default_avatar.svg"
                  }
                  width={20}
                  height={20}
                  alt="Profile"
                  className="rounded-full"
                />
                <span>
                  {transaction.profile.full_name.length > 15
                    ? transaction.profile.full_name.slice(0, 15) + "..."
                    : transaction.profile.full_name}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent side="top" className="flex w-full flex-row gap-4">
              <div className="flex items-center">
                <Image
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                  src={transaction.profile.avatar_url || "/default_avatar.svg"}
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
        }
      </TableCell>
      <TableCell className="text-center">{transaction.service.name}</TableCell>
      <TableCell className="text-center">
        {transaction.service.paper.brand}
      </TableCell>
      <TableCell className="">
        {
          <div className="flex justify-center gap-2">
            <span className="bg-accent-foreground text-accent w-[40px] rounded-md px-2 py-1.5 text-center">
              {transaction.pages}
            </span>
            <span className="bg-card text-accent-foreground w-[40px] rounded-md px-2 py-1.5 text-center">
              {transaction.sheets}
            </span>
          </div>
        }
      </TableCell>
      <TableCell className="">
        {
          <div className="flex justify-center gap-2">
            <span className="bg-accent-foreground text-accent w-[40px] rounded-md px-2 py-1.5 text-center">
              {transaction.service.paper.size}
            </span>
            <span className="bg-card text-accent-foreground w-[100px] rounded-md px-2 py-1.5 text-center">
              {transaction.service.paper.type}
            </span>
          </div>
        }
      </TableCell>
      <TableCell className="">
        {
          <div className="flex flex-row justify-center gap-2">
            {transaction.service.color ? (
              <span className="bg-accent-foreground text-accent w-[100px] rounded-md px-2 py-1.5 text-center">
                Color
              </span>
            ) : (
              <span className="bg-card text-accent-foreground w-[100px] rounded-md px-2 py-1.5 text-center">
                Grayscale
              </span>
            )}
            {transaction.service.duplex ? (
              <span className="bg-accent-foreground text-accent w-[100px] rounded-md px-2 py-1.5 text-center">
                Duplex
              </span>
            ) : (
              <span className="bg-card text-accent-foreground w-[100px] rounded-md px-2 py-1.5 text-center">
                Single
              </span>
            )}
          </div>
        }
      </TableCell>
      <TableCell className="flex items-center justify-center">
        <Link href={transaction.file_url}>
          <Button className="text-xs">Download</Button>
        </Link>
      </TableCell>
      <TableCell className="text-center">
        {transaction.notes ? (
          <Popover>
            <PopoverTrigger>{transaction.notes.slice(0, 20)}...</PopoverTrigger>
            <PopoverContent side="top">
              <span className="font-semibold">Notes</span>
              <div className="overflow-y-auto rounded-md">
                <p>{transaction.notes}</p>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="">
        <div className="flex items-center justify-center gap-2">
          {transaction.payment_method === "Qris" ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <span className="flex items-center gap-2">
                    <QrCode size={16} />
                    QRIS
                  </span>
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
            </>
          ) : (
            <span className="flex items-center gap-2">
              <CircleDollarSignIcon size={16} />
              Cash
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="flex justify-center">
        {formatDateOnly(transaction.created_at)}
      </TableCell>
      <TableCell className="justify-center">
        {transaction.payment_status === "Pending" ? (
          <Button
            variant="default"
            className="bg-pending-foreground/20 dark:bg-pending-background/40 hover:bg-pending-foreground/40 dark:hover:bg-pending-background/20 text-pending-foreground w-full"
          >
            <CircleDashed /> Pending
          </Button>
        ) : (
          <Button className="bg-complete-foreground/20 dark:bg-complete-background/40 hover:bg-complete-foreground/40 dark:hover:bg-complete-background/20 text-complete-foreground w-full">
            <CircleCheck /> Completed
          </Button>
        )}
      </TableCell>
      <TableCell className="justify-center">
        <StatusButton transaction={transaction} />
      </TableCell>
      <TableCell className="">{formatIDR(transaction.service.price)}</TableCell>
      <TableCell className="">{formatIDR(transaction.total_price)}</TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;
