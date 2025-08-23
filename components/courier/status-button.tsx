"use client";
import axios from "axios";
import { Loader2, PackageCheck, PrinterCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const StatusButton = ({ transaction }) => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `/api/transactions/update/status`,
        {
          id,
          status: newStatus,
        },
      );
      toast.success("Transaction status updated successfully");
    } catch (err) {
      toast.error("Failed to update transaction status");
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {transaction.status === "Printed" ? (
        <Button
          disabled={loading}
          onClick={() => updateStatus(transaction.id, "Delivering")}
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
      ) : transaction.status === "Delivering" ? (
        <Button
          disabled={loading}
          onClick={() => updateStatus(transaction.id, "Delivered")}
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
      ) : transaction.status === "Delivered" ? (
        <Button
          disabled={loading}
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