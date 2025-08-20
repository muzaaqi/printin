import HistoryCard from "@/components/history/history-card";
import React from "react";

const HistoryPage = () => {
  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center gap-2 p-4">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground text-sm md:text-md">
          View your past transactions and activities
        </p>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <HistoryCard />
      </div>
    </div>
  );
};

export default HistoryPage;
