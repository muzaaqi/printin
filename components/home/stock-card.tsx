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
import { PaperSheets } from "@/features/get-paper-sheets-realtime";

const StockCard = ({ paper }: { paper: PaperSheets }) => {
  return (
    <>
      <Card className="bg-card-foreground border-muted-foreground w-full shadow-md">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-accent text-xl font-bold">
            {paper.brand}
          </CardTitle>
          <CardDescription className="border-muted-foreground border-b">
            {paper.size} - {paper.type}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p
            className={`text-3xl ${paper.remainingSheets > 10 ? "text-accent" : "text-destructive"} font-bold`}
          >
            {paper.remainingSheets}
            <span className="text-muted-foreground text-sm font-medium">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/services" className="w-full">
            <Button
              disabled={paper.remainingSheets === 0}
              className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
            >
              {paper.remainingSheets > 0 ? "Pesan" : "Habis"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default StockCard;
