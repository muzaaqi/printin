import React from "react";
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
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  sheets: z.number().min(0).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const PapersCard = ({ paper }: { paper: Paper }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };

  const formatIDR = (n: number | null) =>
    n == null ? "-" : `Rp ${n.toLocaleString("id-ID")}`;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{paper.brand}</CardTitle>
          <CardAction>{formatIDR(paper.price)}</CardAction>
          <CardDescription>
            {paper.size} - {paper.type}
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="mb-2 flex justify-center text-center">
              <span className="text-sm font-semibold">Remaining Sheets</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  form.setValue("sheets", (form.getValues("sheets") || 0) - 1)
                }
              >
                <Minus />
              </Button>
              <Input
                {...form.register("sheets", { valueAsNumber: true })}
                defaultValue={paper.sheets}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                onClick={() =>
                  form.setValue("sheets", (form.getValues("sheets") || 0) + 1)
                }
              >
                <Plus />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="mt-3">
            <Button type="submit" className="w-full">Update</Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default PapersCard;
