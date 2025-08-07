import ServicesCard from "@/components/services/services-card";
import React from "react";

const ServicesPage = () => {
  return (
    <div className="w-full items-center justify-center">
      <div className="lg:max-w-screen-xl mx-auto">
      <div className="sm:flex md:grid md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8 py-10">
        <ServicesCard />
        <ServicesCard />
        <ServicesCard />
      </div>
      </div>
    </div>
  );
};

export default ServicesPage;
