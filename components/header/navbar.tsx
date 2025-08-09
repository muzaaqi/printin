import Link from "next/link";
import React from "react";
import Profile from "@/components/header/profile";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

const Navbar = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="w-full sticky bg-background/10 top-0 backdrop-blur-md z-50 border-b border-accent-foreground/20">
      <div className="mx-auto flex items-center justify-between p-2 relative">
        <div className="flex md:ml-4 items-center flex-shrink-0">
          <Link href="/" className="flex items-center text-2xl font-bold ml-2">
            <span className="text-zinc-400">NGE</span>
            <span className="text-popover-foreground">PRINT</span>
          </Link>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="hidden md:flex items-center md:space-x-6 lg:space-x-10 text-lg font-semibold text-popover-foreground">
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

        <div className="flex items-center flex-shrink-0">
          <Profile initialUser={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
