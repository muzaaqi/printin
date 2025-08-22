import type { ReactNode } from "react";
import Navbar from "@/components/header/navbar";

export default function UserLayout({ children }: { children: ReactNode }) {
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
