"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import CheckoutModal from "./checkout-modal";
import { Service } from "@/features/get-all-services";
import { formatIDR } from "@/utils/formatter/currency";
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
        <div className="bg-card flex w-full max-w-sm flex-col space-y-3 rounded-lg border p-4 shadow-md md:space-y-4 md:p-6">
          <div className="grid grid-cols-3 flex-col items-center gap-10 md:flex md:flex-col md:gap-0">
            <div className="md:-h-[100px] w-[100px] md:h-[200px] md:w-[200px]">
              <Image
                src={service.image_url}
                width={200}
                height={200}
                alt={service.name}
                className=""
              />
            </div>
            <div className="col-span-2 md:flex md:flex-col md:items-center">
              <h2 className="font-bold md:text-2xl">{service.name}</h2>
              <p className="md:text-md text-muted-foreground mb-1 text-xs md:mb-3">
                {service.papers?.size} - {service.papers?.type}
              </p>
              <p
                className={`${
                  service.papers?.sheets <= 10
                    ? "bg-destructive"
                    : "bg-accent-foreground"
                } text-accent md:text-md w-1/2 rounded-md px-2 py-1 text-center text-xs font-semibold md:w-fit`}
              >
                {service.papers?.sheets
                  ? `${service.papers?.sheets} Tersisa`
                  : "Habis"}
              </p>
            </div>
          </div>
          <div>
            <div className="border-accent-foreground/20 flex flex-col space-y-1 rounded-lg border px-3 py-2 md:space-y-2">
              <div className="md:text-md flex items-center justify-between border-b text-sm">
                <p>Ukuran Kertas</p>
                <p className="font-semibold">
                  {service.papers?.size}
                  <span className="text-muted-foreground"></span>
                </p>
              </div>
              <div className="md:text-md flex items-center justify-between border-b text-sm">
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
              <div className="md:text-md flex items-center justify-between border-b text-sm">
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
              <div className="md:text-md flex items-center justify-between text-sm">
                <p>Harga</p>
                <p className="font-semibold">
                  {formatIDR(service.price)}
                  <span className="text-muted-foreground">/lembar</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
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
          </div>
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
