"use client";
import {
  subscribeTransaction,
  Transaction,
} from "@/features/get-all-transaction-realtime";
import React, { useEffect, useState } from "react";
import TransactionCard from "./transaction-card";

const TransactionCards = () => {
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    subscribeTransaction((next) => {
      setTransaction(next);
      setLoading(false);
    }).then((u) => (unsub = u));

    return () => {
      if (unsub) unsub();
    };
  }, []);
  return (
    <>
      <div className="text-muted bg-background mx-auto w-full px-4">
        {loading ? (
          <>
            <h1 className="mb-8 text-center text-3xl font-bold"></h1>
            <div className="text-md text-center">Memuat transaksi...</div>
          </>
        ) : transaction.length === 0 ? (
          <div className="text-md text-center">Tidak ada transaksi.</div>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <div className="flex w-max gap-8">
          {transaction.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionCards;
