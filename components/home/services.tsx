"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const servicesList = [
  {
    id: 1,
    title: "Cetak Hitam Putih",
    description: "Hitam Putih",
    url: "/services?filter=grayscale",
    image: "/grayscale-doc.svg",
  },
  {
    id: 2,
    title: "Cetak Berwarna",
    description: "Berwarna",
    url: "/services?filter=color",
    image: "/colorful-doc.svg",
  },
  {
    id: 3,
    title: "Cetak Foto",
    description: "Foto",
    url: "/services?filter=photo",
    image: "/photo.svg",
  },
];

const PopularServices = () => {
  return (
    <div className="mx-auto justify-center w-full max-w-screen-lg lg:px-16">
      <h2 className="text-accent mb-10 text-center text-3xl font-bold underline">
        Melayani
      </h2>
      <Carousel
        className="relative w-full"
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 3000 })]} // Ubah delay menjadi 3 detik agar lebih nyaman
      >
        <CarouselContent>
          {servicesList.map((service) => (
            <CarouselItem
              key={service.id}
              className="h-full basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
            >
              <Card className="mx-auto flex h-full max-w-[250px] flex-col justify-between transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="mx-auto flex flex-grow justify-center">
                  <Image
                    className="w-[130px] object-contain md:w-[150px]"
                    src={service.image}
                    alt={service.title}
                    width={150}
                    height={100}
                    loading="lazy"
                  />
                </CardContent>
                <CardFooter className="mt-auto justify-center">
                  <Button asChild className="text-md w-4/5 font-semibold">
                    <Link href={service.url}>Lihat</Link>
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"default"} className="absolute left-1/12 md:hidden backdrop-blur-md bg-muted-foreground/10 border border-muted-foreground/20" />
        <CarouselNext variant={"default"} className="absolute right-1/12 md:hidden backdrop-blur-md bg-muted-foreground/10 border border-muted-foreground/20" />
      </Carousel>
    </div>
  );
};

export default PopularServices;
