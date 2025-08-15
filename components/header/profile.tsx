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
import { supabase } from "@/utils/supabase/broswer-client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";

const Profile = ({ initialUser }: { initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!mounted) return null; // ⬅ cegah hydration mismatch

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
    } else {
      router.push("/signin");
    }
  };
  return (
    <>
      {user ? (
        <DropdownMenu>
          <div className="flex items-center space-x-2 rounded-lg px-3 py-2">
            <span className="text-md font-semibold md:text-lg">
              {user?.user_metadata?.display_name ||
                user?.user_metadata?.full_name ||
                "User"}
            </span>
            <DropdownMenuTrigger>
              <div className="hover:border-foreground rounded-full border-3 p-0.5 transition-all duration-300">
                <Image
                  src={
                    user.user_metadata.avatar_url
                      ? user.user_metadata.avatar_url
                      : "/default_avatar.svg"
                  }
                  width={40}
                  height={40}
                  alt="avatar"
                  className="h-[30px] w-[30px] rounded-full object-cover md:h-[40px] md:w-[40px]"
                />
              </div>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent
            className="bg-background/50 backdrop-blur-md"
            align="end"
          >
            <DropdownMenuLabel>Akun</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/me">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            {user?.user_metadata?.role === "admin" ? (
              <Link href="/dashboard">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
            ) : (
              <Link href="/me/history">
                <DropdownMenuItem>History</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem
              onClick={signOutUser}
              className="text-destructive"
            >
              Log Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Tampilan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ModeToggle />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex w-1/3 items-center rounded-lg px-3 py-2 transition-all duration-300">
          <Link href={pathname === "/signin" ? "/signup" : "/signin"}>
            <Button className="px-4 py-2 font-semibold md:py-5 md:text-lg">
              {pathname === "/signin" ? "Sign Up" : "Sign In"}
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Profile;
