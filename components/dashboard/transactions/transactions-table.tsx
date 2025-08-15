"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  GetAllTransactionRealtime,
  Transaction,
} from "@/features/get-all-transaction-realtime";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  CircleDashed,
  CircleDollarSignIcon,
  ClockFading,
  Mail,
  Phone,
  QrCode,
} from "lucide-react";
import { formatIDR } from "@/utils/formatter/currency";
import { formatDateOnly } from "@/utils/formatter/datetime";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    GetAllTransactionRealtime((data) => {
      setTransactions(data);
      setLoading(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center font-bold">Customer</TableHead>
            <TableHead className="text-center font-bold">Service</TableHead>
            <TableHead className="text-center font-bold">Brand</TableHead>
            <TableHead className="text-center font-bold">Pages</TableHead>
            <TableHead className="text-center font-bold">Size</TableHead>
            <TableHead className="text-center font-bold">Options</TableHead>
            <TableHead className="text-center font-bold">File</TableHead>
            <TableHead className="text-center font-bold">Notes</TableHead>
            <TableHead className="text-center font-bold">
              Payment Method
            </TableHead>
            <TableHead className="text-center font-bold">Date</TableHead>
            <TableHead className="text-center font-bold">
              Payment Status
            </TableHead>
            <TableHead className="text-center font-bold">Status</TableHead>
            <TableHead className="text-center font-bold">Price</TableHead>
            <TableHead className="text-center font-bold">Total Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 15 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={15} className="text-center">
                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                  </TableCell>
                </TableRow>
              ))
            : transactions.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="">
                    {
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex cursor-pointer flex-row gap-2">
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
                            <span>{transaction.profile.full_name}</span>
                          </div>
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
                              src={
                                transaction.profile.avatar_url ||
                                "/default_avatar.svg"
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
                    }
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.service.name}
                  </TableCell>
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
                        {transaction.service.color ? (
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
                        <PopoverTrigger>
                          {transaction.notes.slice(0, 20)}...
                        </PopoverTrigger>
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
                    {transaction.status === "Pending" ? (
                      <Button
                        variant="default"
                        className="bg-destructive hover:bg-destructive/80 w-full"
                      >
                        <CircleDashed /> Pending
                      </Button>
                    ) : transaction.status === "In Process" ? (
                      <Button variant="default" className="w-full">
                        <ClockFading /> In Process
                      </Button>
                    ) : transaction.status === "Completed" ? (
                      <span className="bg-complete-foreground text-accent flex w-full items-center justify-center gap-2 rounded-md px-3 py-2">
                        <CircleCheck size={16} /> Completed
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="">
                    {formatIDR(transaction.service.price)}
                  </TableCell>
                  <TableCell className="">
                    {formatIDR(transaction.total_price)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
        <TableFooter>
          {!loading && (
            <TableRow>
              <TableCell colSpan={13} className="text-right">
                <span className="font-semibold">Total:</span>
              </TableCell>
              <TableCell className="font-semibold">
                {formatIDR(
                  transactions.reduce((acc, tx) => acc + tx.service.price, 0),
                )}
              </TableCell>
              <TableCell className="font-semibold">
                {formatIDR(
                  transactions.reduce((acc, tx) => acc + tx.total_price, 0),
                )}
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>
    </div>
  );
};

export default TransactionsTable;
