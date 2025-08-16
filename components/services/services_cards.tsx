"use client"
import React, { useEffect, useState } from "react";
import ServicesCard from "./services-card";
import { GetAllServicesStokRealtime, Services } from "@/features/get-all-services-realtime";
import { Skeleton } from "../ui/skeleton";

const ServicesCards = ({ isAuthenticated } : {isAuthenticated: boolean;}) => {
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    GetAllServicesStokRealtime((data) => {
      setServices(data);
      setLoading(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto flex flex-col justify-center px-4 pb-10 sm:px-6 md:grid md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {loading
        ? Array.from({ length: 10 }).map((_, i) => (
            <div className="mx-auto w-full py-10 sm:px-6 lg:px-8" key={i}>
              <Skeleton className="w-100 md:w-90 h-70 md:h-130 mx-auto" />
            </div>
          ))
        : services.map((service) => (
            <ServicesCard
              key={service.id}
              service={service}
              isAuthenticated={isAuthenticated}
            />
          ))}
    </div>
  );
};

export default ServicesCards;
