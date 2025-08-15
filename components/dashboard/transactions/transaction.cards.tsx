"use client";
import React, { useEffect, useState } from "react";
import TransactionCard from "./transaction-card";
import {
  GetAllTransactionRealtime,
  Transaction,
} from "@/features/get-all-transaction-realtime";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionCards = () => {
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
    <>
      <div className="py-1 flex w-max gap-8">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-118 w-80 rounded-xl" />
            ))
          : transactions.map((transaction) => (
              transaction.status !== "Completed" && (
                <TransactionCard key={transaction.id} transaction={transaction} />
              )
            ))}
      </div>
    </>
  );
};

export default TransactionCards;
