import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Paper } from "@/features/get-paper-sheets-realtime";


const StockCard = ({ paper }: { paper: Paper }) => {
  return (
    <>
      <Card className="w-full bg-card-foreground shadow-md border-muted-foreground">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-bold text-xl text-accent">
            {paper.brand}
          </CardTitle>
          <CardDescription className="border-b border-muted-foreground">{paper.size} - {paper.type}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className={`text-3xl ${paper.remainingSheets > 10 ? "text-accent" : "text-destructive"} font-bold`}>
            {paper.remainingSheets}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/services" className="w-full">
            <Button disabled={paper.remainingSheets === 0} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {paper.remainingSheets > 0 ? "Pesan" : "Habis"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default StockCard;
