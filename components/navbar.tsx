import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full sticky top-0 backdrop-blur-md z-50 border-b border-accent-foreground">
      <div className="mx-auto flex justify-between items-center p-2">
        <Link href="/" className="flex items-center text-2xl font-bold ml-2 sm:mr-9">
          <span className="text-zinc-400">NGE</span>
          <span className="text-accent-foreground">PRINT</span>
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex items-center justify-center space-x-4 text-lg font-semibold text-accent-foreground">
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
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent-foreground/10">
            <span className="text-lg font-semibold">Nama Kamu</span>
            <div className="bg-accent-foreground w-[40] h-[40] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
