import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getAllServices } from "@/features/get-all-services";
import { Ban, CircleCheck, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { formatIDR } from "@/utils/formatter/currency";

const ServicesTable = async () => {
  const services = await getAllServices();
  return (
    <div>
      <Table>
        <TableCaption>A list of your services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center font-bold">
              Service Name
            </TableHead>
            <TableHead className="text-center font-bold">
              Service Price
            </TableHead>
            <TableHead className="text-center font-bold">Paper Brand</TableHead>
            <TableHead className="text-center font-bold">Paper Price</TableHead>
            <TableHead className="text-center font-bold">Paper Type</TableHead>
            <TableHead className="text-center font-bold">Color</TableHead>
            <TableHead className="text-center font-bold">Duplex</TableHead>
            <TableHead className="text-center font-bold">Image URL</TableHead>
            <TableHead className="text-center font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service, index) => (
            <TableRow key={service.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="text-center">{service.name}</TableCell>
              <TableCell className="text-center">
                {formatIDR(service.price)}
              </TableCell>

              <TableCell className="text-center">
                {service.paper.brand}
              </TableCell>
              <TableCell className="text-center">
                {formatIDR(service.paper.price)}
              </TableCell>
              <TableCell className="text-center">
                {service.paper.type}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">{service.color ? <CircleCheck className="text-complete-foreground"/> : <Ban className="text-destructive"/>}</div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">{service.duplex ? <CircleCheck className="text-complete-foreground"/> : <Ban className="text-destructive"/>}</div>
              </TableCell>
              <TableCell className="text-center">
                <Popover>
                  <PopoverTrigger>{service.image_url}</PopoverTrigger>
                  <PopoverContent className="w-fit">
                    <Image
                      src={service.image_url}
                      alt="Service Image"
                      width={168}
                      height={200}
                      className="rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell className="flex justify-center text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
