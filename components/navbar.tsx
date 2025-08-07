import Link from "next/link";
import React from "react";
import Profile from "./profile";

const Navbar = () => {
  return (
    <div className="w-full sticky top-0 backdrop-blur-md z-50 border-b-border">
      <div className="mx-auto flex justify-between items-center p-2">
        <Link href="/" className="flex items-center text-2xl font-bold ml-2 sm:mr-9">
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
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
