import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";

import React from 'react'

const SuccessCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pt-15">
        <CircleCheckBig size={100} />
        <CardTitle className="text-lg mt-5">Transaksi Berhasil</CardTitle>
        <CardDescription>Dokumen Anda telah berhasil diproses.</CardDescription>
      </CardHeader>
      <CardContent className="px-10">
        <div className="justify-between flex">
          <span>
            Layanan:
          </span>
          <p>Nama Layanan</p>
        </div>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

export default SuccessCard
