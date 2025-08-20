import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import { PaperRefs } from "./papers-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AddPaperForm = ({
  refs,
  handleSave,
  loading,
}: {
  refs: PaperRefs;
  handleSave: () => Promise<void>;
  loading: boolean;
}) => {
  return (
    <TableRow>
      <TableCell className="text-center">New</TableCell>
      <TableCell>
        <Input type="text" ref={refs.brand} placeholder="Brand" />
      </TableCell>
      <TableCell>
        <Input type="text" ref={refs.size} placeholder="Size" />
      </TableCell>
      <TableCell>
        <Input type="text" ref={refs.type} placeholder="Type" />
      </TableCell>
      <TableCell>
        <Input type="file" ref={refs.image} placeholder="Image" />
      </TableCell>
      <TableCell>
        <Input type="number" ref={refs.price} placeholder="Price" />
      </TableCell>
      <TableCell>
        <Input type="number" ref={refs.sheets} placeholder="Sheets" />
      </TableCell>
      <TableCell className="text-center">
        <Button
          onClick={() => handleSave()}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AddPaperForm;
