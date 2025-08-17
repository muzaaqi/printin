"use client";

import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarUser } from "./sidebar";
import ModeToggle from "../header/mode-toggle";
import Link from "next/link";

const SidebarProfile = ({
  user,
  collapsed,
}: {
  user: SidebarUser | null;
  collapsed: boolean;
}) => {
  const avatar = user?.user_metadata?.avatar_url || "/default_avatar.svg";
  const name = user?.user_metadata?.full_name || "Guest";
  const email = user?.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={[
            `flex w-full items-center gap-2 rounded-md ${collapsed ? "px-0 py-2" : "hover:bg-muted-foreground/10 p-2"}`,
            "group-data-[collapsed=true]/sidebar:justify-center",
          ].join(" ")}
        >
          <Image
            src={avatar}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          {/* Sembunyikan teks saat collapsed */}
          <div className="flex flex-col text-start group-data-[collapsed=true]/sidebar:hidden">
            <span className="text-sm font-semibold">{name}</span>
            <span className="text-muted-foreground text-xs">{email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Navigate</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/">
          <DropdownMenuItem>Home</DropdownMenuItem>
        </Link>
        <Link href="/me">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarProfile;
