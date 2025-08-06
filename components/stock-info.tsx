import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import React from 'react'

const StockInfo = () => {
  return (
    <div className="max-w-7xl mx-auto flex sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-10 px-15 sm:px-20 flex-col items-center justify-center space-y-10 sm:space-y-0">
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-bold text-xl">Kertas A4</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-3xl font-bold">
            10
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="/print-order"
            className="w-full px-4 py-2 bg-accent-foreground text-center text-accent rounded-lg font-medium"
          >
            Pesan
          </Link>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-bold text-xl">Kertas A4</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-3xl font-bold">
            10
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="/print-order"
            className="w-full px-4 py-2 bg-accent-foreground text-center text-accent rounded-lg font-medium"
          >
            Pesan
          </Link>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-bold text-xl">Kertas A4</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-3xl font-bold">
            10
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="/print-order"
            className="w-full px-4 py-2 bg-accent-foreground text-center text-accent rounded-lg font-medium"
          >
            Pesan
          </Link>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-bold text-xl">Kertas A4</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-3xl font-bold">
            10
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              lbr
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="/print-order"
            className="w-full px-4 py-2 bg-accent-foreground text-center text-accent rounded-lg font-medium"
          >
            Pesan
          </Link>
        </CardFooter>
      </Card>
      
    </div>
  );
}

export default StockInfo;
