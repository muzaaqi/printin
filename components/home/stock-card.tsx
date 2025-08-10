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

type StockCardProps = {
  service: {
    id: string;
    serviceName: string;
    remainingStock: number;
  };
};

const StockCard = ({ service }: StockCardProps) => {
  return (
    <>
      <Card className="w-full bg-card-foreground shadow-md border-muted-foreground">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-bold text-xl text-accent">
            {service.serviceName}
          </CardTitle>
          <CardDescription className="border-b border-muted-foreground"></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className={`text-3xl ${service.remainingStock > 10 ? "text-accent" : "text-destructive"} font-bold`}>
            {service.remainingStock}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link href="#" className="w-full">
            <Button disabled={service.remainingStock === 0} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {service.remainingStock > 0 ? "Pesan" : "Habis"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default StockCard;
