"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button onClick={toggleTheme} variant="outline" className="w-full">
      {theme === "light" && (
        <div className="flex items-center space-x-2">
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="text-popover-foreground font-normal">Light</span>
        </div>
      )}
      {theme === "dark" && (
        <div className="flex items-center space-x-2">
          <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="text-popover-foreground font-normal">Dark</span>
        </div>
      )}
      {theme === "system" && (
        <div className="flex items-center space-x-2">
          <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="text-popover-foreground font-normal">System</span>
        </div>
      )}
    </Button>
  );
};

export default ModeToggle;
