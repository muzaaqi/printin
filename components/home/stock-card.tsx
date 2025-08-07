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
import { Button } from '../ui/button';

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
            className="w-full"
          >
            <Button className='w-full bg-background text-accent-foreground hover:bg-accent/90'>Pesan</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

export default StockCard
