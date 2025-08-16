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
  CardAction,
} from "../ui/card";
import { Button } from "../ui/button";
import CheckoutModal from "./checkout-modal";
import { formatIDR } from "@/utils/formatter/currency";
import { Ban, CircleCheck } from "lucide-react";
import { Services } from "@/features/get-all-services-realtime";

const ServicesCard = ({
  service,
  isAuthenticated,
}: {
  service: Services;
  isAuthenticated: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mx-auto w-full py-10 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardHeader className="flex flex-col md:items-center">
            <div className="flex w-full justify-between md:hidden">
              <div className="space-y-1 md:space-y-0">
                <div>
                  <CardTitle className="text-center text-2xl">
                    {service.name}
                  </CardTitle>
                  <CardDescription>
                    {service.paper?.size} - {service.paper?.type}
                  </CardDescription>
                </div>
                <CardDescription
                  className={`${
                    service.paper?.sheets <= 10
                      ? "bg-destructive"
                      : "bg-accent-foreground"
                  } text-accent text-xs w-fit rounded-md px-2 py-1 font-semibold md:hidden`}
                >
                  {service.paper?.sheets
                    ? `${service.paper?.sheets} Tersisa`
                    : "Habis"}
                </CardDescription>
              </div>
              <CardAction>
                <Image
                  src={service.image_url}
                  width={68}
                  height={100}
                  alt={service.name}
                  className="md:hidden"
                />
              </CardAction>
            </div>
            <Image
              src={service.image_url}
              width={136}
              height={200}
              alt={service.name}
              className="hidden md:block"
            />
            <div className="hidden flex-col items-center space-y-2 md:flex">
              <CardTitle className="text-center text-2xl">
                {service.name}
              </CardTitle>
              <CardDescription>
                {service.paper?.size} - {service.paper?.type}
              </CardDescription>
              <CardDescription
                className={`${
                  service.paper?.sheets <= 10
                    ? "bg-destructive"
                    : "bg-accent-foreground"
                } text-accent rounded-md px-2 py-1 font-semibold`}
              >
                {service.paper?.sheets
                  ? `${service.paper?.sheets} Tersisa`
                  : "Habis"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <div className="border-accent-foreground/20 flex w-full flex-col space-y-2 rounded-lg border px-3 py-2 text-xs">
              <div className="flex items-center justify-between border-b">
                <p>Berwarna</p>
                <p className="font-semibold">
                  {service.color ? (
                    <CircleCheck
                      size={16}
                      className="text-complete-foreground inline"
                    />
                  ) : (
                    <Ban size={16} className="text-destructive inline" />
                  )}
                  <span className="text-muted-foreground"></span>
                </p>
              </div>
              <div className="flex items-center justify-between border-b">
                <p>Bolak Balik</p>
                <p className="font-semibold">
                  {service.duplex ? (
                    <CircleCheck
                      size={16}
                      className="text-complete-foreground inline"
                    />
                  ) : (
                    <Ban size={16} className="text-destructive inline" />
                  )}
                  <span className="text-muted-foreground"></span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Harga</p>
                <p className="font-semibold">
                  {formatIDR(service.price)}
                  <span className="text-muted-foreground">/lbr</span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              disabled={service.paper?.sheets === 0 || !isAuthenticated}
              onClick={() => setOpen(true)}
              className={`w-full ${service.paper?.sheets === 0 || !isAuthenticated ? "cursor-not-allowed" : ""}`}
            >
              {service.paper?.sheets === 0
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
