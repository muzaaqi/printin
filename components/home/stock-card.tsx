import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const StockCard = () => {
  return (
    <>
      <Card className="w-full bg-accent-foreground shadow-md border-accent">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-bold text-xl text-accent">Kertas A4</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-3xl text-accent font-bold">
            10
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="#"
            className="w-full px-4 py-2 bg-accent text-center text-accent-foreground rounded-lg font-medium"
          >
            Pesan
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

export default StockCard
