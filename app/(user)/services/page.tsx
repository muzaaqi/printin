import ServicesCards from "@/components/services/services-cards";
import { getCurrentUser } from "@/features/get-current-user";
import React from "react";

const ServicesPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="w-full items-center justify-center">
      <div className="container mx-auto mt-5 lg:mt-10">
        <div className="flex flex-col mx-auto w-full text-center justify-center">
          <h1 className="text-3xl font-bold">Layanan</h1>
          <p>Pilih sesuai kebutuhan Anda!</p>
        </div>
        <ServicesCards isAuthenticated={!!user} />
      </div>
    </div>
  );
};

export default ServicesPage;
