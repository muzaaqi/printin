import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import OrdersCard from "@/components/courier/orders-cards";
import WorkingStatusSwitch from "@/components/courier/working-status-switch";
import { getCurrentUser } from "@/hooks/profile/get-current-user";

const OrdersPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="container mx-auto justify-center">
      <div className="mt-4 grid space-y-3 px-4 md:px-0">
        <Card>
          <CardContent className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Mulai Pengiriman</h2>
            </div>
            <WorkingStatusSwitch userId={user?.id} />
          </CardContent>
        </Card>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Daftar Pengiriman
          </span>
        </div>
        <div>
          <OrdersCard />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
