import { getCurrentUser } from "@/hooks/profile/get-current-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProfileCard from "./profile-card";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto grid max-w-md items-center space-y-5 px-5 md:space-y-10">
      <div className="mt-3 text-center md:mt-10">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Customize Your Profile!</p>
      </div>
      <ProfileCard user={user} />
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Daftar Jadi Kurir
        </span>
      </div>
      <Link href="register-courier">
        <Button className="w-full text-xs">Daftar</Button>
      </Link>
    </div>
  );
};

export default ProfilePage;
