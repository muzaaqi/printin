"use client";
import React, { useState } from "react";
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
import AddServiceForm from "./add-service-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GetAllPapers } from "@/features/get-all-papers";
import { addNewService } from "@/hooks/services/add-new-service";

const ServicesTable = ({
  services,
  papers,
}: {
  services: Service[];
  papers: GetAllPapers;
}) => {
  const [loadingAddService, setLoadingAddService] = useState<boolean>(false);
  const [AddService, setAddService] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: null as string | null,
    paperId: null as string | null,
    color: null as string | null,
    duplex: null as string | null,
    image: null as File | null,
    price: null as number | null,
  });

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.paperId ||
      !formData.color ||
      !formData.duplex ||
      !formData.image ||
      !formData.price
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoadingAddService(true);
    const res = await addNewService(formData);
    if (res.success) {
      toast.success("Service added successfully");
      setFormData({
        name: null,
        paperId: null,
        color: null,
        duplex: null,
        image: null,
        price: null,
      });
      setAddService(false);
    } else {
      toast.error("Failed to add service", {
        description: res.error,
      });
    }
    setLoadingAddService(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Papers</h2>
        <div className="flex items-center gap-2">
          <Button
            disabled={loadingAddService}
            variant={AddService ? "destructive" : "default"}
            onClick={() => setAddService(!AddService)}
          >
            {AddService ? "Cancel" : "Add Service"}
          </Button>
          {AddService && (
            <Button
              disabled={
                loadingAddService ||
                !formData.name ||
                !formData.paperId ||
                !formData.color ||
                !formData.duplex ||
                !formData.image ||
                !formData.price
              }
              variant="default"
              onClick={handleSave}
            >
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
            <TableHead className="text-center font-bold">Image</TableHead>
            <TableHead className="text-center font-bold">Paper Price</TableHead>
            <TableHead className="text-center font-bold">
              Service Price
            </TableHead>
            <TableHead className="text-center font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AddService && (
            <AddServiceForm
              formData={formData}
              setFormData={setFormData}
              loadingAddService={loadingAddService}
              handleSave={handleSave}
              papers={papers}
            />
          )}
          {services.map((service, index) => (
            <ServiceTableRow
              key={service.id}
              service={service}
              index={index}
              papers={papers}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
