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
    typeof window !== "undefined" ? window.location.hash : "",
  );
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <ul className="hidden items-center text-lg font-semibold md:flex md:space-x-6 lg:space-x-10">
      {links.map((link) => {
        const isActive =
          (link.hash
            ? pathname === "/" && hash === link.hash
            : pathname === link.href) ||
          (link.href === "/" && pathname === "/"); // default root
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`relative inline-block py-2 transition-colors ${
                isActive
                  ? "text-popover-foreground"
                  : "text-popover-foreground/70 hover:text-popover-foreground"
              } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded after:transition-all after:duration-200 ${
                isActive
                  ? "after:bg-primary"
                  : "hover:after:bg-primary/70 after:bg-transparent"
              } `}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
