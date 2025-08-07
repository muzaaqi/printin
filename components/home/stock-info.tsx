import React from "react";
import StockCard from "./stock-card";

const StockInfo = () => {
  return (
    <div className="max-w-7xl mx-auto flex sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-10 px-15 sm:px-20 flex-col items-center justify-center space-y-10 sm:space-y-0">
      <StockCard />
      <StockCard />
      <StockCard />
    </div>
  );
};

export default StockInfo;
