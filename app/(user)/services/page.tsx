import ServicesCard from "@/components/services/services-card";
import { getServices } from "@/features/get-services";
import { getUserData } from "@/features/get-user-data";


const ServicesPage = async () => {
  const user = await getUserData();
  const services = await getServices();

  return (
    <div className="w-full items-center justify-center">
      <div className="lg:max-w-screen-xl mx-auto mt-10">
        <div className="flex flex-col mx-auto w-full text-center justify-center">
          <h1 className="text-3xl font-bold">Services</h1>
          <p>Choose one of our services!</p>
        </div>
        <div className="flex sm:flex md:grid md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8 py-10">
          {services.map((service) => (
            <ServicesCard key={service.id} service={service} isAuthenticated={!!user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
