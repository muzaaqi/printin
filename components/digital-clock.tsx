"use client"; // Enables client-side rendering for this component
// Import necessary hooks from React
import { useState, useEffect, useMemo } from "react";

// Import custom UI components from the UI directory

import { Button } from "@/components/ui/button";

// Default export of the DigitalClockComponent function
export default function DigitalClockComponent() {
  const [mounted, setMounted] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [is12Hour, setIs12Hour] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const formattedDate = dateTime.toLocaleDateString("en-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = is12Hour
    ? dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
  return (
    <>
      <Button
        variant={is12Hour ? "default" : "outline"}
        onClick={() => setIs12Hour(!is12Hour)}
        className="p-8 font-bold"
      >
        <div className="items-center justify-center text-4xl font-bold tracking-tight">
          {formattedTime}
        </div>
      </Button>
      <div className="flex items-center justify-center text-center text-lg font-semibold">
        <span>{formattedDate}</span>
      </div>
    </>
  );
}
