import HistoryCard from "@/components/history/history-card";
import React from "react";

const HistoryPage = () => {
  return (
    <div className="min-h-screen">
      <div className="p-4 items-center flex flex-col gap-2">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground">
          View your past transactions and activities
        </p>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <HistoryCard />
      </div>
    </div>
  );
};

export default HistoryPage;
