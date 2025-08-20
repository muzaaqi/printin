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
  GetAllTransactionRealtime,
  Transaction,
} from "@/features/get-all-transaction-realtime";
import { formatIDR } from "@/utils/formatter/currency";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionTableRow from "./transaction-table-row";

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
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
        </TableBody>
        <TableFooter>
          {!loading && (
            <TableRow>
              <TableCell colSpan={14} className="text-right">
                <span className="font-semibold">Total:</span>
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
