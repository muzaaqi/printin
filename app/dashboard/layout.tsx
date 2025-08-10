import type { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ngeprint | Dashboard",
  description: "Ngeprint - Your Printing Solution",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Tidak ada navbar di sini
  return <>{children}</>;
}
