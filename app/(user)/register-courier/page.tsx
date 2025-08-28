import RegisterForm from "@/components/courier/register-form";
import { getCurrentUser } from "@/hooks/profile/get-current-user";
import React from "react";

const CourierRegisterPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto flex h-screen items-center justify-center">
      <RegisterForm user={user} />
    </div>
  );
};

export default CourierRegisterPage;
