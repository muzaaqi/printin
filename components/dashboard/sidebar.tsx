"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarProfile from "./profile";
import SidebarNav from "./navigation";
import { PanelLeftOpen, PanelLeftClose, Printer } from "lucide-react";

export interface SidebarUser {
  email: string | null;
  user_metadata?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

const STORAGE_KEY = "dashboard:sidebar-collapsed";

const Sidebar = ({ user }: { user: SidebarUser | null }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Restore state dari localStorage
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) setCollapsed(saved === "1");
  }, []);

  // Simpan state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    }
  }, [collapsed]);

  return (
    <div className="flex">
      <div
        data-collapsed={collapsed ? "true" : "false"}
        className={[
          "group/sidebar bg-muted/20 backdrop-blur-md relative flex h-screen flex-col px-3 py-3 transition-[width] duration-500",
          collapsed ? "w-16" : "w-fit",
        ].join(" ")}
      >
        <div className="mb-3 flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center group-data-[collapsed=true]/sidebar:[&_span]:hidden"
          >
            <div className="p-2">
              <Printer />
            </div>
            <span className="text-2xl font-bold text-zinc-400">NGE</span>
            <span className="text-popover-foreground text-2xl font-bold group-data-[collapsed=true]/sidebar:hidden">
              PRINT
            </span>
          </Link>
        </div>

        {/* Navigasi: sembunyikan label saat collapsed */}
        <div
          className={[
            "mt-2",
            // Sembunyikan semua h2 (label) di dalam navigation ketika collapsed
            "group-data-[collapsed=true]/sidebar:[&_h2]:hidden",
            // Center content saat collapsed
            "group-data-[collapsed=true]/sidebar:[&_a]:justify-center",
          ].join(" ")}
        >
          <SidebarNav />
        </div>

        {/* Dorong profile ke bawah */}
        <div className="mt-auto">
          <SidebarProfile user={user} collapsed={collapsed} />
        </div>
      </div>
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={() => setCollapsed((v) => !v)}
        className={`absolute bottom-4 ${collapsed ? "left-15" : "left-70"} hover:bg-muted-foreground/10 mt-auto ml-5 inline-flex h-auto w-10 items-center justify-center rounded-md p-2 backdrop-blur`}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? (
          <PanelLeftOpen size={22} className="text-muted-foreground" />
        ) : (
          <PanelLeftClose size={22} />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
