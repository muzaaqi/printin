import type { ReactNode } from "react";
import Navbar from "@/components/header/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
