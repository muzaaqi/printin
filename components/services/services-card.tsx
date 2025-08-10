"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import CheckoutModal from "./checkout-modal";
import type { Service } from "./type";

const ServicesCard = ({
  service,
  isAuthenticated,
}: {
  service: Service;
  isAuthenticated: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const formatIDR = (n: number | null) =>
    n == null ? "-" : `Rp ${n.toLocaleString("id-ID")}`;
  return (
    <>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center">
            <Image
              src={service.imageUrl}
              width={200}
              height={200}
              alt={service.serviceName}
            />
            <CardTitle className="text-2xl text-center">
              {service.serviceName}
            </CardTitle>
            <CardDescription
              className={`${
                service.remainingStock <= 10
                  ? "bg-destructive"
                  : "bg-accent-foreground"
              } text-accent font-semibold px-2 py-1 rounded-md`}
            >
              {service.remainingStock
                ? `${service.remainingStock} Tersisa`
                : "Habis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col border border-accent-foreground/20 px-3 py-2 rounded-lg">
              <CardTitle className="text-lg font-semibold self-center mb-1">
                Harga
              </CardTitle>
              <div className="flex justify-between items-center border-b">
                <p>B&W - 1 Sisi</p>
                <p className="font-semibold">
                  {formatIDR(service.prices["priceSingleSide"])}
                  <span className="text-muted-foreground">/lbr</span>
                </p>
              </div>
              <div className="flex justify-between items-center border-b">
                <p>B&W - 2 Sisi</p>
                <p className="font-semibold">
                  {formatIDR(service.prices["priceDoubleSides"])}
                  <span className="text-muted-foreground">/lbr</span>
                </p>
              </div>
              <div className="flex justify-between items-center border-b">
                <p>Warna - 1 Sisi</p>
                <p className="font-semibold">
                  {formatIDR(service.prices["priceColorSingleSide"])}
                  <span className="text-muted-foreground">/lbr</span>
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p>Warna - 2 Sisi</p>
                <p className="font-semibold">
                  {formatIDR(service.prices["priceColorDoubleSides"])}
                  <span className="text-muted-foreground">/lbr</span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              disabled={service.remainingStock === 0 || !isAuthenticated}
              onClick={() => setOpen(true)}
              className="w-full"
            >
              {service.remainingStock === 0
                ? "Stok Habis"
                : !isAuthenticated
                ? "Sign In untuk Checkout"
                : "Checkout"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <CheckoutModal
        service={service}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default ServicesCard;
