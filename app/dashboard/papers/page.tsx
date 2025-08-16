import PapersCards from "@/components/dashboard/papers/papers-cards";
import { Button } from "@/components/ui/button";
import React from "react";

const PapersPage = () => {
  return (
    <div>
      <div className="bg-muted dark:bg-muted/20 overflow-x-auto rounded-lg p-3">
        <PapersCards className="flex w-max gap-8" skeleton="h-110 w-60" />
      </div>
    </div>
  );
};

export default PapersPage;
