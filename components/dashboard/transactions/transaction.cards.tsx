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
      <div className="flex w-max gap-8 py-1">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-118 w-80 rounded-xl" />
            ))
          : (() => {
              const activeTransactions = transactions.filter(
                (transaction) => transaction.status !== "Completed",
              );

              return activeTransactions.length === 0 ? (
                <div className="h-118 w-7xl mx-auto self-center flex flex-col items-center justify-center">
                  <p className="text-muted-foreground">
                    All transactions have been completed
                  </p>
                </div>
              ) : (
                activeTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              );
            })()}
      </div>
    </>
  );
};

export default TransactionCards;
