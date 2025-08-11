"use client"
import React, {useState, useEffect} from "react";
import StockCard from "./stock-card";
import { Paper, subscribePaperRemainingSheets } from "@/features/get-paper-sheets-realtime";


const StockInfo =  () => {
  const [papers, setPapers] = useState<Paper[]>([]);
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
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 text-muted">
      {loading ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Stok Kertas</h1>
          <div className="text-center text-md">Memuat stok kertas...</div>
        </>
      ) : papers.length === 0 ? (
        <div className="text-center text-md">Tidak ada stok kertas tersedia.</div>
      ) : null}
    </div>
    <div className="max-w-7xl mx-auto flex sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-5 md:gap-10 lg:gap-15 px-18 md:px-10 lg:px-20 flex-col items-center justify-center space-y-10 sm:space-y-0">
      {papers.map((paper) => (
        <StockCard key={paper.id} paper={paper} />
      ))}
    </div>
    </>
  );
};

export default StockInfo;
