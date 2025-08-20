"use client"
import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Service } from "@/features/get-all-services";
import ServiceTableRow from "./service-table-row";
import { toast } from "sonner";
import axios from "axios";
import AddServiceForm from "./add-service-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GetAllPapers } from "@/features/get-all-papers";

export interface ServiceRefs {
  name: React.RefObject<HTMLInputElement | null>;
  paperId: React.RefObject<HTMLInputElement | null>;
  color: React.RefObject<HTMLInputElement | null>;
  duplex: React.RefObject<HTMLInputElement | null>;
  image: React.RefObject<HTMLInputElement | null>;
  price: React.RefObject<HTMLInputElement | null>;
}

const ServicesTable = ({services, papers} : {services: Service[], papers: GetAllPapers} ) => {
  const [loadingAddService, setLoadingAddService] = useState<boolean>(false);
  const [AddService, setAddService] = useState<boolean>(false);

  const serviceRefs: ServiceRefs = ({
    name: useRef<HTMLInputElement>(null),
    paperId: useRef<HTMLInputElement>(null),
    color: useRef<HTMLInputElement>(null),
    duplex: useRef<HTMLInputElement>(null),
    image: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
  });

  const handleSave = async () => {
    const values = Object.fromEntries(
      Object.entries(serviceRefs).map(([key, ref]) => {
        if (key === "image") {
          return [key, ref.current?.files?.[0] || null];
        }
        return [key, ref.current?.value || ""];
      }),
    );
    setLoadingAddService(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== null) {
          formData.append(key, val as Blob | string);
        }
      });

      const res = await axios.post("/api/services/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Service saved successfully!");
    } catch (error) {
      toast.error("Error saving service.");
      console.error("Error saving service:", error);
    } finally {
      Object.values(serviceRefs).forEach((ref) => {
        if (ref.current) ref.current.value = "";
      });
      setLoadingAddService(false);
      setAddService(false);
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Papers</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={AddService ? "destructive" : "default"}
            onClick={() => setAddService(!AddService)}
          >
            {AddService ? "Cancel" : "Add Service"}
          </Button>
          {AddService && (
            <Button variant="default" onClick={handleSave}>
              {loadingAddService ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Service"
              )}
            </Button>
          )}
        </div>
      </div>
      
      <Table>
        <TableCaption>A list of your services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center font-bold">
              Service Name
            </TableHead>
            <TableHead className="text-center font-bold">Paper Brand</TableHead>
            <TableHead className="text-center font-bold">Paper Type</TableHead>
            <TableHead className="text-center font-bold">Color</TableHead>
            <TableHead className="text-center font-bold">Duplex</TableHead>
            <TableHead className="text-center font-bold">Image URL</TableHead>
            <TableHead className="text-center font-bold">
              Service Price
            </TableHead>
            <TableHead className="text-center font-bold">Paper Price</TableHead>
            <TableHead className="text-center font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AddService && (
            <AddServiceForm serviceRefs={serviceRefs} loadingAddService={loadingAddService} handleSave={handleSave} papers={papers} />
          )}
          {services.map((service, index) => (
            <ServiceTableRow key={service.id} service={service} index={index} papers={papers} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
