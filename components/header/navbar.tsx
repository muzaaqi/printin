import Link from "next/link";
import React from "react";
import Profile from "@/components/header/profile";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

const Navbar = async () => {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="w-full sticky bg-background/10 top-0 backdrop-blur-md z-50 border-b border-accent-foreground/20">
      <div className="mx-auto flex justify-between items-center p-2">
        <Link href="/" className="flex items-center text-2xl font-bold ml-2">
          <span className="text-zinc-400">NGE</span>
          <span className="text-popover-foreground">PRINT</span>
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex items-center justify-center space-x-4 text-lg font-semibold text-popover-foreground">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/#about">About</Link>
            </li>
          </ul>
        </nav>
        <div>
          <Profile initialUser={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
