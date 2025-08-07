import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export default async function PrivatePage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/signin");
  }

  return <p>Hello {data.user.email}</p>;
}
