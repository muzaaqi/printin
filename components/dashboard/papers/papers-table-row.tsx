import { TableCell, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Paper } from "@/features/get-all-papers-realtime";
import Image from "next/image";
import React, { useRef } from "react";
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
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PaperRefs } from "./papers-table";
import { formatIDR } from "@/utils/formatter/currency";

const PapersTableRow = ({ paper, index }: { paper: Paper; index: number }) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const refs: PaperRefs = {
      brand: useRef<HTMLInputElement>(null),
      size: useRef<HTMLInputElement>(null),
      type: useRef<HTMLInputElement>(null),
      image: useRef<HTMLInputElement>(null),
      price: useRef<HTMLInputElement>(null),
      sheets: useRef<HTMLInputElement>(null),
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
      formData.append("id", paper.id);

      const res = await axios.patch("/api/papers/update/data", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Paper updated successfully");
        setIsEdit(false);
      } else {
        toast.error("Failed to update paper");
      }
    } catch (error) {
      console.error("Error updating paper:", error);
      toast.error("Error updating paper");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete("/api/papers/delete", {
        data: { id: paper.id },
      });
      toast.success("Paper deleted successfully");
    } catch (error) {
      toast.error("Error deleting paper");
      console.error("Error deleting paper:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TableRow>
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input defaultValue={paper.brand} ref={refs.brand} />
        ) : (
          paper.brand
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? <Input defaultValue={paper.size} ref={refs.size} /> : paper.size}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? <Input defaultValue={paper.type} ref={refs.type} /> : paper.type}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? (
          <Input type="file" ref={refs.image} />
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
        {isEdit ? <Input defaultValue={paper.price} ref={refs.price} /> : formatIDR(paper.price)}
      </TableCell>
      <TableCell className="text-center">
        {isEdit ? <Input defaultValue={paper.sheets} ref={refs.sheets} /> : paper.sheets}
      </TableCell>
      <TableCell className="flex items-center justify-center text-center">
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

export default PapersTableRow;
