"use client"
import { Paper, subscribePapers } from "@/features/get-all-papers-realtime";
import React, { useState, useEffect } from "react";
import PapersCard from "./papers-card";


const PapersCards = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    subscribePapers((next) => {
      setPapers(next);
      setLoading(false);
    }).then((u) => (unsub = u));

    return () => {
      if (unsub) unsub();
    };
  }, []);
  return (
    <>
      <div className="text-muted mx-auto w-full px-4 bg-background">
        {loading ? (
          <>
            <h1 className="mb-8 text-center text-3xl font-bold">Stok Kertas</h1>
            <div className="text-md text-center">Memuat stok kertas...</div>
          </>
        ) : papers.length === 0 ? (
          <div className="text-md text-center">
            Tidak ada stok kertas tersedia.
          </div>
        ) : null}
      </div>
      <div className="mx-auto flex">
        {papers.map((paper) => (
          <PapersCard key={paper.id} paper={paper} />
        ))}
      </div>
    </>
  );
};

export default PapersCards;
