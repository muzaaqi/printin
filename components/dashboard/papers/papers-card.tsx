import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Paper } from "@/features/get-all-papers-realtime";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { formatIDR } from "@/utils/formatter/currency";
import { toast } from "sonner";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  sheets: z.number().min(0).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const PapersCard = ({ paper }: { paper: Paper }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const [isPlus, setIsPlus] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    const newSheets = data.sheets || 0;
    if (newSheets === 0) {
      toast.warning("Cannot update sheets to zero");
      return;
    }
    const totalSheets = isPlus
      ? paper.sheets + newSheets
      : paper.sheets - newSheets;

    if (totalSheets < 0) {
      toast.warning("Cannot have negative sheets");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch(`/api/papers/update/sheets`, {
        paperId: paper.id,
        totalSheets: totalSheets,
      });
      toast.success("Updated sheets successfully");
    } catch (error) {
      toast.error("Failed to update sheets", {
        description: error instanceof Error ? error.message : String(error),
      });
      console.error("Update sheets error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{paper.brand}</CardTitle>
          <CardAction className="text-muted-foreground text-sm">
            {formatIDR(paper.price)}
          </CardAction>
          <CardDescription>
            {paper.size} - {paper.type}
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="mb-2 flex flex-col items-center justify-center text-center">
              <Image
                src={paper.image_url}
                alt={paper.brand}
                width={136}
                height={100}
                className="object-contain"
              />
              <span className="text-sm font-semibold">Remaining Sheets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 items-center gap-2">
                <span
                  className={`bg-input text-input-foreground flex items-center justify-center rounded-md px-2 py-1.5 ${paper.sheets <= 10 ? "text-destructive" : ""}`}
                >
                  {paper.sheets}
                </span>
                <Button
                  variant={isPlus ? "default" : "destructive"}
                  type="button"
                  onClick={() => setIsPlus(!isPlus)}
                  disabled={loading}
                >
                  {isPlus ? <Plus /> : <Minus />}
                </Button>
              </div>
              <Input
                {...form.register("sheets", { valueAsNumber: true })}
                className="w-20 text-center"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-3">
            <Button disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default PapersCard;
