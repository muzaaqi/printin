import { supabase } from "@/utils/supabase/broswer-client";
import type {
  RealtimePostgresChangesPayload,
  User,
} from "@supabase/supabase-js";
import { getCurrentUser } from "./get-current-user";

export const GetCurrentUserRealtime = async (
  onChange: (user: User) => void,
): Promise<User> => {
  const user = await getCurrentUser();

  onChange(user as unknown as User);

  const channel = supabase
    .channel("user-changes")
    .on<RealtimePostgresChangesPayload<User>>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${user?.id}`,
      },
      async () => {
        const updatedUser = await getCurrentUser();
        if (updatedUser) {
          onChange(updatedUser as unknown as User);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
