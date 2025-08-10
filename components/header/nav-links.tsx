"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/services", label: "Layanan" },
  { href: "/#about", label: "Tentang", hash: "#about" },
];

export function NavLinks() {
  const pathname = usePathname();
  const [hash, setHash] = useState<string>(
    typeof window !== "undefined" ? window.location.hash : ""
  );
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <ul className="hidden md:flex items-center md:space-x-6 lg:space-x-10 text-lg font-semibold">
      {links.map((l) => {
        const isActive =
          (l.hash
            ? pathname === "/" && hash === l.hash
            : pathname === l.href) ||
          (l.href === "/" && pathname === "/"); // default root
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`relative inline-block py-2 transition-colors
                ${
                  isActive
                    ? "text-popover-foreground"
                    : "text-popover-foreground/70 hover:text-popover-foreground"
                }
                after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:rounded
                after:transition-all after:duration-200
                ${
                  isActive
                    ? "after:bg-primary"
                    : "after:bg-transparent hover:after:bg-primary/70"
                }
              `}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
