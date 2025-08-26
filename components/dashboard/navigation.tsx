"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  Layers,
  SquareChartGantt,
  SquareMousePointer,
  Truck,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: SquareChartGantt },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: ArrowRightLeft,
  },
  { href: "/dashboard/services", label: "Services", icon: SquareMousePointer },
  { href: "/dashboard/papers", label: "Papers", icon: Layers },
  { href: "/dashboard/couriers", label: "Couriers", icon: Truck },
];

const SidebarNav = () => {
  const pathname = usePathname();
  // Normalisasi trailing slash (jika ada)
  const path = pathname?.replace(/\/$/, "") || "/dashboard";

  const isActive = (href: string) => {
    const hrefNorm = href.replace(/\/$/, "");
    // Overview: harus eksak
    if (hrefNorm === "/dashboard") return path === "/dashboard";
    // Lainnya: boleh prefix (sub-routes)
    return path === hrefNorm || path.startsWith(hrefNorm + "/");
  };

  return (
    <ul className="text-muted-foreground mt-4 space-y-2 text-lg font-semibold">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <li key={href}>
            <Link
              href={href}
              title={label}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-2 rounded-md px-2 py-2 transition-colors",
                active
                  ? "bg-muted-foreground/10 text-accent-foreground"
                  : "hover:bg-muted-foreground/10",
              ].join(" ")}
            >
              <Icon />
              <h2 className="text-lg font-semibold group-data-[collapsed=true]/sidebar:hidden">
                {label}
              </h2>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNav;
