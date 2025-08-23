import React from "react";
import {History} from "lucide-react";
import { getTransactionByCourierId } from "@/features/get-transaction-by-courier-id";
import OrderCard from "./order-card";

const OrdersCard = async () => {
  const transactions = await getTransactionByCourierId();
  return (
    <>
      {transactions.length > 0 ? (
        <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((transaction) => (
            transaction.status === "Printed" || transaction.status === "Delivering" ? (
              <OrderCard key={transaction.id} transaction={transaction} />
            ) : null
          ))}
        </div>
      ) : (
        <div className="mx-auto flex min-h-screen flex-col place-items-center justify-center">
          <History className="text-muted-foreground h-12 w-12 -translate-y-35" />
          <p className="-translate-y-35">Belum ada pesanan saat ini</p>
        </div>
      )}
    </>
  );
};

export default OrdersCard;
