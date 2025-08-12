import { Metadata } from "next";
import Sidebar, { type SidebarUser } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/features/get-current-user";

export const metadata: Metadata = {
  title: "Ngeprint | Dashboard",
  description: "Ngeprint - Your Printing Solution",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getCurrentUser()) as SidebarUser | null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar kiri: tidak menyusut, penuh tinggi */}
      <aside className="border-border h-full shrink-0 border-r">
        <Sidebar user={user} />
      </aside>
      {/* Konten kanan: ambil sisa lebar dan jadi area scroll */}
      <main className="h-full min-w-0 flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
