import PapersCards from "@/components/dashboard/papers/papers-cards";
import { Button } from "@/components/ui/button";
import React from "react";

const PapersPage = () => {
  return (
    <div className="">
      <div className="mb-4 flex justify-end">
        <Button className="">Add Paper</Button>
      </div>
      <div className="bg-muted p-3 rounded-lg overflow-x-auto">
        <PapersCards />
      </div>
    </div>
  );
};

export default PapersPage;
