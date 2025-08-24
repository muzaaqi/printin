"use client";
import React, { useEffect, useState } from "react";
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
  GetAllPapersRealtime,
  Paper,
} from "@/features/get-all-papers-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import PapersTableRow from "./papers-table-row";
import { Button } from "@/components/ui/button";
import AddPaperForm from "./add-paper-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatIDR } from "@/utils/formatter/currency";
import { addNewPaper } from "@/hooks/papers/add-new-paper";

export interface PaperRefs {
  brand: React.RefObject<HTMLInputElement | null>;
  size: React.RefObject<HTMLInputElement | null>;
  type: React.RefObject<HTMLInputElement | null>;
  image: React.RefObject<HTMLInputElement | null>;
  price: React.RefObject<HTMLInputElement | null>;
  sheets: React.RefObject<HTMLInputElement | null>;
}

const PapersTable = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAddPaper, setLoadingAddPaper] = useState(false);
  const [addPaper, setAddPaper] = useState(false);
  const [formData, setFormData] = useState({
    brand: null as string | null,
    size: null as string | null,
    type: null as string | null,
    image: null as File | null,
    price: null as number | null,
    sheets: null as number | null,
  });

  const handleSave = async () => {
    if (
      !formData.brand ||
      !formData.size ||
      !formData.type ||
      !formData.image ||
      !formData.price ||
      !formData.sheets
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoadingAddPaper(true);

    const res = await addNewPaper(formData);
    if (res.success) {
      toast.success("Paper added successfully!");
      setFormData({
        brand: null,
        size: null,
        type: null,
        image: null,
        price: null,
        sheets: null,
      });
      setAddPaper(false);
    } else {
      toast.error("Error adding paper.", { description: res.error });
    }
    setLoadingAddPaper(false);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    GetAllPapersRealtime((data) => {
      setPapers(data);
      setLoading(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Papers</h2>
        <div className="flex items-center gap-2">
          <Button
            disabled={loading}
            variant={addPaper ? "destructive" : "default"}
            onClick={() => setAddPaper(!addPaper)}
          >
            {addPaper ? "Cancel" : "Add Paper"}
          </Button>
          {addPaper && (
            <Button
              disabled={
                loadingAddPaper ||
                !formData.brand ||
                !formData.size ||
                !formData.type ||
                !formData.image ||
                !formData.price ||
                !formData.sheets
              }
              variant="default"
              onClick={handleSave}
            >
              {loadingAddPaper ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Paper"
              )}
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableCaption>A list of your papers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center font-bold">Brand</TableHead>
            <TableHead className="text-center font-bold">Size</TableHead>
            <TableHead className="text-center font-bold">Type</TableHead>
            <TableHead className="text-center font-bold">Image</TableHead>
            <TableHead className="text-center font-bold">Sheets</TableHead>
            <TableHead className="text-center font-bold">Price</TableHead>
            <TableHead className="text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addPaper && (
            <AddPaperForm
              formData={formData}
              setFormData={setFormData}
              handleSave={handleSave}
              loading={loadingAddPaper}
            />
          )}
          {loading
            ? Array.from({ length: 15 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={15} className="text-center">
                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                  </TableCell>
                </TableRow>
              ))
            : papers.map((paper, index) => (
                <PapersTableRow key={paper.id} paper={paper} index={index} />
              ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}></TableCell>
            <TableCell className="text-center font-semibold">Total</TableCell>
            <TableCell className="text-center font-bold">
              {formatIDR(
                papers.reduce((acc, paper) => acc + (paper.price || 0), 0),
              )}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default PapersTable;
