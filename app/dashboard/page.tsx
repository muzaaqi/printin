import React from "react";
import PapersCards from "@/components/dashboard/papers/papers-cards";
import TransactionCards from "@/components/dashboard/transactions/transaction.cards";
import DigitalClockComponent from "@/components/digital-clock";

const Dashboardpage = () => {
  return (
    <div className="flex max-w-screen justify-between gap-5">
      <div className="flex h-fit w-8/10 flex-col gap-10">
        <div className="bg-muted dark:bg-muted/20 rounded-xl p-8">
          <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
          <div className="scrollbar-hide h-fit overflow-x-auto rounded-lg">
            <TransactionCards />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-muted dark:bg-muted/20 h-fit rounded-lg p-8">
          <div className="flex flex-col items-center justify-center space-y-1">
            <DigitalClockComponent />
          </div>
        </div>
        <div className="bg-muted dark:bg-muted/20 mb-5 flex h-svh w-fit flex-col rounded-xl p-8">
          <h1 className="mb-4 text-2xl font-bold">Papers</h1>
          <div className="scrollbar-hide h-full overflow-y-auto rounded-lg">
            <PapersCards className="flex w-max flex-col gap-8" skeleton="h-60 w-60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;
