"use client";
import React, { useRef, useState } from "react";
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
import axios from "axios";
import { toast } from "sonner";
import { Paper } from "@/features/get-all-papers-realtime";
import { Button } from "@/components/ui/button";
import { ServiceRefs } from "./services-table";

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

  const refs: ServiceRefs = {
    name: useRef<HTMLInputElement>(null),
    paperId: useRef<HTMLInputElement>(null),
    color: useRef<HTMLInputElement>(null),
    duplex: useRef<HTMLInputElement>(null),
    image: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
  };

  const onUpdate = async () => {
      setLoading(true);
      const values = Object.fromEntries(
        Object.entries(refs).map(([key, ref]) => {
          if (key === "image") {
            return [key, ref.current?.files?.[0] || null]; // file asli
          }
          return [key, ref.current?.value || ""];
        }),
      );
  
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => {
          if (val !== null) {
            formData.append(key, val);
          }
        });
        formData.append("id", service.id);
  
        const res = await axios.patch("/api/service/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        if (res.status === 200) {
          toast.success("Service updated successfully");
          setIsEdit(false);
        } else {
          toast.error("Failed to update service");
        }
      } catch (error) {
        console.error("Error updating service:", error);
        toast.error("Error updating service");
      } finally {
        setLoading(false);
      }
    };

  const onDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`/api/services/delete`, {
        data: { id: service.id },
      });

      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error("Error deleting service");
      console.error("Error deleting service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow key={service.id}>
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            className="w-fit border-none ring-0 focus:border-none focus:ring-0"
            type="text"
            defaultValue={service.name}
            ref={refs.name}
          />
        ) : (
          service.name
        )}
      </TableCell>
      {isEdit ? (
        <TableCell colSpan={2}>
          <Select>
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
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"true"}></SelectItem>
              <SelectItem value={"false"}></SelectItem>
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
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"true"}></SelectItem>
              <SelectItem value={"false"}></SelectItem>
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
          <Input type="file" ref={refs.image}/>
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
            defaultValue={formatIDR(service.price)}
            ref={refs.price}
          />
        ) : (
          formatIDR(service.price)
        )}
      </TableCell>
      <TableCell className="flex justify-center text-center">
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
      </TableCell>
    </TableRow>
  );
};

export default ServiceTableRow;
