import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceRefs } from "./services-table";
import { GetAllPapers } from "@/features/get-all-papers";

const AddServiceForm = ({
  serviceRefs,
  loadingAddService,
  papers,
  handleSave,
}: {
  serviceRefs: ServiceRefs;
  handleSave: () => Promise<void>;
  loadingAddService: boolean;
  papers: GetAllPapers;
}) => {
  return (
    <TableRow>
      <TableCell className="text-center">New</TableCell>
      <TableCell>
        <Input type="text" ref={serviceRefs.name} placeholder="Name" />
      </TableCell>
      <TableCell colSpan={2}>
        <Select onValueChange={(value) => (serviceRefs.paperId.current!.value = value)}>
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
      <TableCell>
        <Select onValueChange={(value) => (serviceRefs.color.current!.value = value)}>
          <SelectTrigger className="w-full">
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"true"}>TRUE</SelectItem>
            <SelectItem value={"false"}>FALSE</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select onValueChange={(value) => (serviceRefs.duplex.current!.value = value)}>
          <SelectTrigger className="w-full">
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"true"}>TRUE</SelectItem>
            <SelectItem value={"false"}>FALSE</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input type="file" ref={serviceRefs.image} placeholder="Image" />
      </TableCell>
      <TableCell>
        <Input type="number" ref={serviceRefs.price} placeholder="Price" />
      </TableCell>
      <TableCell></TableCell>
      <TableCell className="text-center">
        <Button onClick={() => handleSave()} disabled={loadingAddService}>
          {loadingAddService ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AddServiceForm;
