"use client";
import React, { useState, useEffect } from "react";
import StockCard from "./stock-card";
import {
  PaperSheets,
  subscribePaperRemainingSheets,
} from "@/features/get-paper-sheets-realtime";

const StockInfo = () => {
  const [papers, setPapers] = useState<PaperSheets[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    subscribePaperRemainingSheets((next) => {
      setPapers(next);
      setLoading(false);
    }).then((u) => (unsub = u));

    return () => {
      if (unsub) unsub();
    };
  }, []);
  return (
    <>
      <div className="text-muted mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
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
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center space-y-10 px-18 sm:grid sm:grid-cols-2 sm:gap-5 sm:space-y-0 md:grid-cols-3 md:gap-10 md:px-10 lg:gap-15 lg:px-20 xl:grid-cols-4">
        {papers.map((paper) => (
          <StockCard key={paper.id} paper={paper} />
        ))}
      </div>
    </>
  );
};

export default StockInfo;
