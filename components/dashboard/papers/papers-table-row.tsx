import { TableCell, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Paper } from "@/features/get-all-papers-realtime";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { formatIDR } from "@/utils/formatter/currency";
import { updatePaperById } from "@/hooks/papers/update-paper-by-id";
import { deletePaperById } from "@/hooks/papers/delete-paper-by-id";

const PapersTableRow = ({ paper, index }: { paper: Paper; index: number }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: paper.id,
    brand: paper.brand,
    size: paper.size,
    type: paper.type,
    image: null as File | null,
    price: paper.price,
    sheets: paper.sheets,
  });

  const handleChange = (name: string, value: string | number | File | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onUpdate = async () => {
    setLoading(true);

    const res = await updatePaperById(formData);
    if (res.success) {
      toast.success("Paper updated successfully");
      setIsEdit(false);
    } else {
      toast.error("Failed to update paper", {
        description: res.error,
      });
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    const res = await deletePaperById(paper.id);
    if (res.success) {
      toast.success("Paper deleted successfully");
    } else {
      toast.error("Failed to delete paper", {
        description: res.error,
      });
    }
    setLoading(false);
  };
  return (
    <TableRow>
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
        ) : (
          paper.brand
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            value={formData.size}
            onChange={(e) => handleChange("size", e.target.value)}
          />
        ) : (
          paper.size
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
          />
        ) : (
          paper.type
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
                src={paper.image_url}
                alt={paper.brand}
              />
            </PopoverContent>
          </Popover>
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            value={formData.sheets}
            onChange={(e) => handleChange("sheets", Number(e.target.value))}
          />
        ) : (
          paper.sheets
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input
            value={formData.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        ) : (
          formatIDR(paper.price)
        )}
      </TableCell>
      <TableCell className="flex items-center justify-center text-center">
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

export default PapersTableRow;
