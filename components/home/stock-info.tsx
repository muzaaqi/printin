import React from "react";
import StockCard from "./stock-card";
import { Card } from "../ui/card";

const StockInfo = () => {
  return (
    <div className="max-w-7xl mx-auto flex md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-10 lg:gap-15 px-18 md:px-20 flex-col items-center justify-center space-y-10 sm:space-y-0">
      <StockCard />
      <StockCard />
      <StockCard />
      <Card className="w-full h-full bg-accent-foreground shadow-md border-accent text-center flex items-center justify-center">
        <div className="text-center text-2xl font-bold text-accent">
          <h1>Coming</h1>
          <h1>Soon</h1>
        </div>
      </Card>
    </div>
  );
};

export default StockInfo;
