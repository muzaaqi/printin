"use client";

import { supabase } from "@/utils/supabase/broswer-client";
import { useEffect, useState } from "react";


export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return;
      }

      const user = data.user;
      const userRole = user?.user_metadata?.role || null;
      setRole(userRole);
    };

    getRole();
  }, []);

  return role;
}
