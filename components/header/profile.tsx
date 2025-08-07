"use client";
import React, {useState, useEffect} from "react";
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

const Profile = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setAvatarUrl(user.user_metadata?.avatar_url || null);
        setName(user.user_metadata?.full_name || user.email || "User");
      }
    };

    fetchUser();
  }, []);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-foreground/10 transition-all duration-300">
            <span className="text-lg font-semibold">{name}</span>
            <div className="border-3 p-0.5 rounded-full hover:border-foreground transition-all duration-300">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  width={40}
                  height={40}
                  alt="avatar"
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="bg-foreground w-10 h-10 rounded-full" />
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Transaction</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Preference</DropdownMenuLabel>
          <DropdownMenuItem>
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Profile;
