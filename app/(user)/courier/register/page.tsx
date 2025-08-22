import RegisterForm from "@/components/courier/register-form";
import { getCurrentUser } from "@/features/get-current-user";
import React from "react";

const CourierRegisterPage = async () => {
  const user = await getCurrentUser();

  
  return (
    <div className="mx-auto flex h-screen items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default CourierRegisterPage;
