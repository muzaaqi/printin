import React from "react";
import Image from "next/image";
import { getCurrentUser } from "@/features/get-current-user";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatter/datetime";
import Link from "next/link";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto grid max-w-md  items-center space-y-5 px-5 md:space-y-10">
      <div className="mt-3 text-center md:mt-10">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Customize Your Profile!</p>
      </div>
      <div className="bg-card flex w-full flex-col items-center justify-center rounded-lg border p-5 md:p-10">
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
        <div className="bg-card mt-4 w-full space-y-2 rounded-lg border p-3">
          <div className="md:text-md flex justify-between gap-5 text-sm">
            <p>Email</p>
            <p className="text-muted-foreground">
              {user?.email || "Unknown Email"}
            </p>
          </div>
          <div className="md:text-md flex justify-between gap-5 text-sm">
            <p>Telepon</p>
            <p className="text-muted-foreground">
              {user?.phone || "Unknown Phone"}
            </p>
          </div>
          <div className="md:text-md flex justify-between gap-5 text-sm">
            <p>Alamat</p>
            <p className="text-muted-foreground">
              {user?.user_metadata?.address || "Unknown Address"}
            </p>
          </div>
          <div className="md:text-md flex justify-between gap-5 text-sm">
            <p>Bergabung Pada</p>
            <p className="text-muted-foreground">
              {formatDate(user?.created_at) || "Unknown Join Date"}
            </p>
          </div>
        </div>
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Daftar Jadi Kurir
        </span>
      </div>
      <Link href="courier-register">
        <Button className="w-full text-xs">Daftar</Button>
      </Link>
    </div>
  );
};

export default ProfilePage;
