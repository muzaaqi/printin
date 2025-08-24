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
import { GetAllPapers } from "@/features/get-all-papers";

const AddServiceForm = ({
  formData,
  setFormData,
  loadingAddService,
  papers,
  handleSave,
}: {
  formData: {
    name: string | null;
    paperId: string | null;
    color: string | null;
    duplex: string | null;
    image: File | null;
    price: number | null;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string | null;
      paperId: string | null;
      color: string | null;
      duplex: string | null;
      image: File | null;
      price: number | null;
    }>
  >;
  handleSave: () => Promise<void>;
  loadingAddService: boolean;
  papers: GetAllPapers;
}) => {
  const handleChange = (name: string, value: string | number | File | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <TableRow>
      <TableCell className="text-center">New</TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder="Name"
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </TableCell>
      <TableCell colSpan={2}>
        <Select
          value={formData.paperId || ""}
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
      <TableCell>
        <Select
          value={formData.color || ""}
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
      </TableCell>
      <TableCell>
        <Select
          value={formData.duplex || ""}
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
      </TableCell>
      <TableCell>
        <Input
          type="file"
          placeholder="Image"
          onChange={(e) => handleChange("image", e.target.files?.[0] || null)}
        />
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Price"
          value={formData.price || ""}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
      </TableCell>
      <TableCell className="text-center">
        <Button onClick={() => handleSave()} disabled={loadingAddService || !formData.name || !formData.paperId || !formData.color || !formData.duplex || !formData.image || !formData.price}>
          {loadingAddService ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add"
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AddServiceForm;
