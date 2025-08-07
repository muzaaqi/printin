import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModeToggle from "./mode-toggle";

const Profile = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-foreground/10 transition-all duration-300">
            <span className="text-lg font-semibold">Nama Kamu</span>
            <div className="border-3 p-0.5 rounded-full hover:border-foreground transition-all duration-200">
              <div className="bg-foreground w-[40] h-[40] rounded-full"></div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Transaction</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Prefference</DropdownMenuLabel>
          <DropdownMenuItem>
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Profile;
