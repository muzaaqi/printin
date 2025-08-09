import React from "react";
import StockCard from "./stock-card";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";

const StockInfo = () => {
  return (
    <div className="max-w-7xl mx-auto flex sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-5 md:gap-10 lg:gap-15 px-18 md:px-10 lg:px-20 flex-col items-center justify-center space-y-10 sm:space-y-0">
      <StockCard />
      <StockCard />
      <StockCard />
      <Card className="w-full h-full bg-card-foreground shadow-md border-muted-foreground text-center flex items-center justify-center">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="text-center text-2xl font-bold text-accent">
            <h1>Coming</h1>
            <h1>Soon</h1>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-lg text-muted-foreground">Sabar!</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StockInfo;
