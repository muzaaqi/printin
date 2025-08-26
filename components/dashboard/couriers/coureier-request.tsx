import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { acceptCourierRequest } from "@/hooks/couriers/accept-request";
import { Courier } from "@/hooks/couriers/couriers-types";
import { rejectCourierRequest } from "@/hooks/couriers/reject-request";
import { formatDateTime } from "@/utils/formatter/datetime";
import { CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

const CourierRequest = ({ request }: { request: Courier }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleAccept = async () => {
    setIsLoading(true);
    const res = await acceptCourierRequest(request.id);
    if (res.success) {
      toast.success("Courier request accepted");
    } else if (!res.success) {
      toast.error("Failed to accept courier request", { description: res.error });
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);
    const res = await rejectCourierRequest(request.id);
    if (res.success) {
      toast.success("Courier request rejected");
    } else if (!res.success) {
      toast.error("Failed to reject courier request", { description: res.error });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card>
        <CardContent className="flex w-auto items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={request.profile.avatar_url}
              alt="Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <h2 className="font-semibold">{request.full_name}</h2>
              <span className="text-muted-foreground">{request.email}</span>
            </div>
          </div>
          <div className="flex gap-5">
            {/* <div className="grid space-y-2">
            <span className="text-muted-foreground text-end text-sm">
              {formatDateTime(request.created_at)}
            </span>
            <span className="text-end text-sm">{request.area}</span>
          </div> */}
            <div className="grid grid-cols-2 items-center gap-2">
              <Button
                onClick={handleReject}
                disabled={isLoading}
                variant="default"
                className="bg-destructive/10 text-destructive hover:bg-destructive/20 h-10 w-10 rounded-full"
              >
                <CircleX size={20} />
              </Button>
              <Button
                onClick={handleAccept}
                disabled={isLoading}
                variant="default"
                className="bg-complete-background/10 text-complete-foreground hover:bg-complete-background/20 h-10 w-10 rounded-full"
              >
                <CircleCheck size={20} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CourierRequest;
