"use client";
import {
  GetAllPapersRealtime,
  Paper,
} from "@/features/get-all-papers-realtime";
import React, { useState, useEffect } from "react";
import PapersCard from "./papers-card";
import { Skeleton } from "@/components/ui/skeleton";

const PapersCards = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

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
    <>
      <div className="flex flex-col w-max gap-8">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-60 w-60 rounded-xl" />
            ))
          : papers.map((paper) => <PapersCard key={paper.id} paper={paper} />)}
      </div>
    </>
  );
};

export default PapersCards;
