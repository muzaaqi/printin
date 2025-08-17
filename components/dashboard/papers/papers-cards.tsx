"use client";
import {
  GetAllPapersRealtime,
  Paper,
} from "@/features/get-all-papers-realtime";
import React, { useState, useEffect } from "react";
import PapersCard from "./papers-card";
import { Skeleton } from "@/components/ui/skeleton";

const PapersCards = ({className, skeleton} : {className?: string, skeleton?: string}) => {
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
      <div className={`${className}`}>
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className={`${skeleton} rounded-xl`} />
            ))
          : papers.length > 0 ? (
              papers.map((paper) => <PapersCard key={paper.id} paper={paper} />)
            ) : (
              <p>No papers found</p>
            )}
      </div>
    </>
  );
};

export default PapersCards;
