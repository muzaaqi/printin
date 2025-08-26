"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "./get-user-role-server";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getUserRole().then(setRole);
  }, []);

  return role;
}
