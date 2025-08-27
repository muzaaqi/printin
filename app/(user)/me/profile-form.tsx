import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";

import { UseFormReturn } from "react-hook-form";
import { ProfileSchema } from "@/lib/schema/profile";

const ProfileForm = ({
  user,
  form,
}: {
  user: User | null;
  form: UseFormReturn<ProfileSchema>;
}) => {
  return (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <Input disabled defaultValue={user?.email || ""} />

      <FormLabel>Telepon</FormLabel>
      <Input defaultValue={user?.phone || ""} {...form.register("phone")} />
      <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
      <FormLabel>Alamat</FormLabel>
      <Input
        defaultValue={user?.user_metadata?.address || ""}
        {...form.register("address")}
      />
      <FormMessage>{form.formState.errors.address?.message}</FormMessage>
    </FormItem>
  );
};

export default ProfileForm;
