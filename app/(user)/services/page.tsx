import ServicesCard from "@/components/services/services-card";
import { getCurrentUser } from "@/features/get-current-user";
import { getAllServices } from "@/features/get-all-services";

const ServicesPage = async () => {
  const user = await getCurrentUser();
  const services = await getAllServices();
  return (
    <div className="w-full items-center justify-center">
      <div className="lg:max-w-screen-xl mx-auto mt-10">
        <div className="flex flex-col mx-auto w-full text-center justify-center">
          <h1 className="text-3xl font-bold">Services</h1>
          <p>Choose one of our services!</p>
        </div>
        <div className="flex mx-auto justify-center md:grid md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8 py-10">
          {services.map((service) => (
            <ServicesCard
              key={service.id}
              service={service}
              isAuthenticated={!!user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
