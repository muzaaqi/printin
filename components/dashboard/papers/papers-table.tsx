"use client";
import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import AddPaperForm from "./add-paper-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  const refs: PaperRefs = {
    brand: useRef<HTMLInputElement>(null),
    size: useRef<HTMLInputElement>(null),
    type: useRef<HTMLInputElement>(null),
    image: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
    sheets: useRef<HTMLInputElement>(null),
  };

  const handleSave = async () => {
    const values = Object.fromEntries(
      Object.entries(refs).map(([key, ref]) => {
        if (key === "image") {
          return [key, ref.current?.files?.[0] || null]; // file asli
        }
        return [key, ref.current?.value || ""];
      }),
    );
    setLoadingAddPaper(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== null) {
          formData.append(key, val as Blob | string);
        }
      });

      const res = await axios.post("/api/papers/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Paper saved successfully!");
    } catch (error) {
      toast.error("Error saving paper.");
      console.error("Error saving paper:", error);
    } finally {
      Object.values(refs).forEach((ref) => {
        if (ref.current) ref.current.value = "";
      });
      setLoadingAddPaper(false);
      setAddPaper(false);
    }
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
            variant={addPaper ? "destructive" : "default"}
            onClick={() => setAddPaper(!addPaper)}
          >
            {addPaper ? "Cancel" : "Add Paper"}
          </Button>
          {addPaper && (
            <Button variant="default" onClick={handleSave}>
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
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">No</TableHead>
            <TableHead className="text-center font-bold">Brand</TableHead>
            <TableHead className="text-center font-bold">Size</TableHead>
            <TableHead className="text-center font-bold">Type</TableHead>
            <TableHead className="text-center font-bold">Image</TableHead>
            <TableHead className="text-center font-bold">Price</TableHead>
            <TableHead className="text-center font-bold">Sheets</TableHead>
            <TableHead className="text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addPaper && <AddPaperForm refs={refs} handleSave={handleSave} loading={loadingAddPaper} />}
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
      </Table>
    </div>
  );
};

export default PapersTable;
