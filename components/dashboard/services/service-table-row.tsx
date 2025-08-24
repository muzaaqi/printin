"use client";
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatIDR } from "@/utils/formatter/currency";
import { Ban, CircleCheck, EllipsisVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { Service } from "@/features/get-all-services";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Paper } from "@/features/get-all-papers-realtime";
import { Button } from "@/components/ui/button";
import { updateServiceById } from "@/hooks/services/update-service-by-id";
import { deleteServiceById } from "@/hooks/services/delete-service-by-id";

const ServiceTableRow = ({
  service,
  index,
  papers,
}: {
  service: Service;
  index: number;
  papers: Paper[];
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: service.id,
    name: service.name,
    paperId: service.paper.id,
    color: service.color ? "true" : "false",
    duplex: service.duplex ? "true" : "false",
    image: null as File | null,
    price: service.price,
  });

  const handleChange = (name: string, value: string | number | File | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onUpdate = async () => {
    setLoading(true);
    const res = await updateServiceById(formData);
    if (res.success) {
      toast.success("Service updated successfully");
      setIsEdit(false);
    } else if (!res.success) {
      toast.error("Failed to update service", {
        description: res.error,
      });
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    const res = await deleteServiceById(service.id);
    if (res.success) {
      toast.success("Service deleted successfully");
    } else {
      toast.error("Delete Failed", {
        description: res.error,
      });
    }
    setLoading(false);
  };

  return (
    <TableRow key={service.id}>
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            className="w-fit border-none ring-0 focus:border-none focus:ring-0"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        ) : (
          service.name
        )}
      </TableCell>
      {isEdit ? (
        <TableCell colSpan={2}>
          <Select
            value={formData.paperId}
            onValueChange={(value) => handleChange("paperId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {papers.map((paper) => (
                <SelectItem key={paper.id} value={paper.id}>
                  {paper.brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
      ) : (
        <>
          <TableCell className="text-center">{service.paper.brand}</TableCell>
          <TableCell className="text-center">
            {service.paper.size} - {service.paper.type}
          </TableCell>
        </>
      )}
      <TableCell className="text-center">
        {isEdit ? (
          <Select
            value={formData.color}
            onValueChange={(value) => handleChange("color", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"true"}>TRUE</SelectItem>
              <SelectItem value={"false"}>FALSE</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex justify-center">
            {service.color ? (
              <CircleCheck className="text-complete-foreground" />
            ) : (
              <Ban className="text-destructive" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Select
            value={formData.duplex}
            onValueChange={(value) => handleChange("duplex", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"true"}>TRUE</SelectItem>
              <SelectItem value={"false"}>FALSE</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex justify-center">
            {service.duplex ? (
              <CircleCheck className="text-complete-foreground" />
            ) : (
              <Ban className="text-destructive" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            type="file"
            onChange={(e) => handleChange("image", e.target.files?.[0] || null)}
          />
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">View Image</Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <Image
                width={136}
                height={200}
                src={service.image_url}
                alt={service.name}
              />
            </PopoverContent>
          </Popover>
        )}
      </TableCell>
      <TableCell className="text-center">
        {formatIDR(service.paper.price)}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            className="w-fit border-none ring-0 focus:border-none focus:ring-0"
            type="text"
            value={formData.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        ) : (
          formatIDR(service.price)
        )}
      </TableCell>
      <TableCell className="flex justify-center text-center">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isEdit ? (
                <>
                  <DropdownMenuItem asChild onClick={onUpdate}>
                    <button className="w-full" type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={loading}
                    onClick={() => setIsEdit(false)}
                    className="text-destructive"
                  >
                    Cancel
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    disabled={loading}
                    onClick={() => setIsEdit(true)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={loading}
                    className="text-destructive"
                    onClick={onDelete}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ServiceTableRow;
