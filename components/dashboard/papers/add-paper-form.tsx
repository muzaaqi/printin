import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AddPaperForm = ({
  formData,
  setFormData,
  handleSave,
  loading,
}: {
  formData: {
    brand: string | null;
    size: string | null;
    type: string | null;
    image: File | null;
    price: string | null;
    sheets: string | null;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      brand: string | null;
      size: string | null;
      type: string | null;
      image: File | null;
      price: string | null;
      sheets: string | null;
    }>
  >;
  handleSave: () => Promise<void>;
  loading: boolean;
}) => {
  const handleChange = (name: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <TableRow>
      <TableCell className="text-center">New</TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder="Brand"
          value={formData.brand || ""}
          onChange={(e) => handleChange("brand", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder="Size"
          value={formData.size || ""}
          onChange={(e) => handleChange("size", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder="Type"
          value={formData.type || ""}
          onChange={(e) => handleChange("type", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="file"
          placeholder="Image"
          onChange={(e) => handleChange("image", e.target.files?.[0] || null)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Price"
          value={formData.price || 0}
          onChange={(e) => handleChange("price", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Sheets"
          value={formData.sheets || ""}
          onChange={(e) => handleChange("sheets", e.target.value)}
        />
      </TableCell>
      <TableCell className="text-center">
        <Button onClick={() => handleSave()} disabled={loading || !formData.brand || !formData.size || !formData.type || !formData.image || !formData.price || !formData.sheets}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AddPaperForm;
