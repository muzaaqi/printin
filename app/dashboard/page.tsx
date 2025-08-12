import React from "react";
import PapersCards from "@/components/dashboard/papers/papers-cards";
import TransactionCards from "@/components/dashboard/transactions/transaction.cards";

const Dashboardpage = () => {
  return (
    <div className="w-full">
      <div className="mb-5 bg-muted dark:bg-muted/20 overflow-x-auto rounded-lg p-8">
        <PapersCards />
      </div>
      <div className="mb-5 bg-muted dark:bg-muted/20 overflow-x-auto rounded-lg p-8">
        <TransactionCards />
      </div>
    </div>
  );
};

export default Dashboardpage;
