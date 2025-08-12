import React from "react";
import Image from "next/image";
import { getCurrentUser } from "@/features/get-current-user";
import { Button } from "@/components/ui/button";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  const formatDate = (iso?: string) => {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Unknown";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <div className="mx-auto flex max-w-md flex-col items-center space-y-10">
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Customize Your Profile!</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center rounded-md border p-10">
        <div className="rounded-full border-2 p-1">
          <Image
            src={user?.user_metadata?.avatar_url || "/default_avatar.svg"}
            width={100}
            height={100}
            alt="Profile Picture"
            className="rounded-full"
          />
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">
            {user?.user_metadata?.full_name || "Unknown User"}
          </h2>
          <Button className="mt-2 text-xs">Edit Profile</Button>
        </div>
        <div className="mt-4 w-full space-y-2 rounded-md border p-3">
          <div className="flex justify-between gap-5">
            <p>Email</p>
            <p className="text-muted-foreground">
              {user?.email || "Unknown Email"}
            </p>
          </div>
          <div className="flex justify-between gap-5">
            <p>Telepon</p>
            <p className="text-muted-foreground">
              {user?.phone || "Unknown Phone"}
            </p>
          </div>
          <div className="flex justify-between gap-5">
            <p>Alamat</p>
            <p className="text-muted-foreground">
              {user?.user_metadata?.address || "Unknown Address"}
            </p>
          </div>
          <div className="flex justify-between gap-5">
            <p>Bergabung Pada</p>
            <p className="text-muted-foreground">
              {formatDate(user?.created_at) || "Unknown Join Date"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
