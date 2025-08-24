"use client";
import {
  CircleDashed,
  ClockFading,
  Loader2,
  PackageCheck,
  PrinterCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { updateTransactionStatus } from "@/hooks/transaction-status-update";

const StatusButton = ({
  transaction,
}: {
  transaction: { id: string; status: string };
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(transaction.status)

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    const res = await updateTransactionStatus(transaction.id, newStatus);
    if (res.success) {
      setStatus(newStatus)
      toast.success("Transaction status updated successfully");
    } else if (!res.success) {
      toast.error("Failed to update transaction status", {
        description: res.error,
      });
    }
    setLoading(false);
  };
  return (
    <>
      {status === "Pending" ? (
        <Button
          onClick={() => updateStatus("In Process")}
          disabled={loading}
          variant="default"
          className={`bg-destructive hover:bg-destructive/80 w-full ${loading ? "cursor-wait" : "cursor-pointer"}`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CircleDashed /> Pending
            </>
          )}
        </Button>
      ) : status === "In Process" ? (
        <Button
          onClick={() => updateStatus("Printed")}
          disabled={loading}
          variant="default"
          className={`w-full cursor-pointer ${loading ? "cursor-wait" : "cursor-pointer"}`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ClockFading /> In Process
            </>
          )}
        </Button>
      ) : status === "Printed" ? (
        <Button
          disabled={loading}
          onClick={() => updateStatus("Delivering")}
          className={
            "bg-complete-background/20 text-complete-foreground flex items-center gap-1 rounded-md px-2 py-1.5"
          }
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <PrinterCheck size={16} />
              Printed
            </>
          )}
        </Button>
      ) : status === "Delivering" ? (
        <Button
          disabled={loading}
          onClick={() => updateStatus("Delivered")}
          className={
            "bg-delivering-background/20 text-delivering-foreground flex items-center gap-1 rounded-md px-2 py-1.5"
          }
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Truck size={16} />
              Delivering
            </>
          )}
        </Button>
      ) : status === "Delivered" ? (
        <Button
          disabled={loading}
          onClick={() => updateStatus("Completed")}
          className={
            "bg-pending-background/20 text-pending-foreground flex items-center gap-1 rounded-md px-2 py-1.5"
          }
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <PackageCheck size={16} />
              Delivered
            </>
          )}
        </Button>
      ) : (
        <h2>Pesanan Selesai</h2>
      )}
    </>
  );
};

export default StatusButton;
