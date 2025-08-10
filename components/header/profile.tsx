"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModeToggle from "./mode-toggle";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/utils/supabase/broswer-client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";

const Profile = ({ initialUser }: { initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const supabase = createSupabaseBrowserClient();
  const pathname = usePathname();
  const router = useRouter();

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
    } else {
      router.push("/signin");
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);
  return (
    <>
      {user ? (
        <DropdownMenu>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg">
            <span className="text-md md:text-lg font-semibold">
              {user?.user_metadata?.display_name ||
                user?.user_metadata?.full_name ||
                "User"}
            </span>
            <DropdownMenuTrigger>
              <div className="border-3 p-0.5 rounded-full hover:border-foreground transition-all duration-300">
                <Image
                  src={
                    user.user_metadata.avatar_url
                      ? user.user_metadata.avatar_url
                      : "/default_avatar.svg"
                  }
                  width={40}
                  height={40}
                  alt="avatar"
                  className="rounded-full object-cover w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                />
              </div>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/me">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            {user?.user_metadata?.role === "admin" ? (
              <Link href="/dashboard">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
            ) : (
              <DropdownMenuItem>Riwayat</DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={signOutUser}
              className="text-destructive"
            >
              Log Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Tampilan</DropdownMenuLabel>
            <DropdownMenuItem>
              <ModeToggle />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="w-1/3 flex items-center px-3 py-2 rounded-lg transition-all duration-300">
          <Link href={pathname === "/signin" ? "/signup" : "/signin"}>
            <Button className="md:text-lg font-semibold px-4 py-2 md:py-5">
              {pathname === "/signin" ? "Sign Up" : "Sign In"}
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Profile;
