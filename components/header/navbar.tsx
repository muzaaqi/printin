import Link from "next/link";
import React from "react";
import Profile from "@/components/header/profile";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { NavLinks } from "./nav-links";

const Navbar = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="bg-background/10 border-accent-foreground/20 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="relative mx-auto flex items-center justify-between p-2">
        <div className="flex flex-shrink-0 items-center md:ml-4">
          <Link href="/" className="ml-2 flex items-center text-2xl font-bold">
            <span className="text-zinc-400">NGE</span>
            <span className="text-popover-foreground">PRINT</span>
          </Link>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <NavLinks />
        </nav>

        <div className="flex flex-shrink-0 items-center">
          <Profile initialUser={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
