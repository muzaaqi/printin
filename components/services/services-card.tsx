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
import { Service } from "@/features/get-all-services";
import { formatIDR } from "@/features/format";
import { Ban, CircleCheck } from "lucide-react";

const ServicesCard = ({
  service,
  isAuthenticated,
}: {
  service: Service;
  isAuthenticated: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center">
            <Image
              src={service.image_url}
              width={200}
              height={200}
              alt={service.name}
            />
            <CardTitle className="text-center text-2xl">
              {service.name}
            </CardTitle>
            <CardDescription>
              {service.papers?.size} - {service.papers?.type}
            </CardDescription>
            <CardDescription
              className={`${
                service.papers?.sheets <= 10
                  ? "bg-destructive"
                  : "bg-accent-foreground"
              } text-accent rounded-md px-2 py-1 font-semibold`}
            >
              {service.papers?.sheets
                ? `${service.papers?.sheets} Tersisa`
                : "Habis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-accent-foreground/20 flex flex-col rounded-lg border px-3 py-2 space-y-2">
              <CardTitle className="mb-1 self-center text-lg font-semibold">
                Harga
              </CardTitle>
              <div className="flex items-center justify-between border-b">
                <p>Ukuran Kertas</p>
                <p className="font-semibold">
                  {service.papers?.size}
                  <span className="text-muted-foreground"></span>
                </p>
              </div>
              <div className="flex items-center justify-between border-b">
                <p>Berwarna</p>
                <p className="font-semibold">
                  {service.color ? <CircleCheck size={16} className="inline text-complete-foreground" /> : <Ban size={16} className="inline text-destructive" />}
                  <span className="text-muted-foreground"></span>
                </p>
              </div>
              <div className="flex items-center justify-between border-b">
                <p>Bolak Balik</p>
                <p className="font-semibold">
                  {service.duplex ? <CircleCheck size={16} className="inline text-complete-foreground" /> : <Ban size={16} className="inline text-destructive" />}
                  <span className="text-muted-foreground"></span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Harga</p>
                <p className="font-semibold">
                  {formatIDR(service.price)}
                  <span className="text-muted-foreground">/lembar</span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              disabled={service.papers?.sheets === 0 || !isAuthenticated}
              onClick={() => setOpen(true)}
              className={`w-full ${service.papers?.sheets === 0 || !isAuthenticated ? "cursor-not-allowed" : ""}`}
            >
              {service.papers?.sheets === 0
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
