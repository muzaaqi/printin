"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courierRegisterSchema, CourierRegisterSchema } from "@/lib/schema/courier-register";
import { User } from "@supabase/supabase-js";

const RegisterForm = ({user} : {user: User}) => {
  const form = useForm<CourierRegisterSchema>({
    resolver: zodResolver(courierRegisterSchema),
  });

  return (
    <Card className="mx-auto max-w-md min-w-sm">
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <CardHeader>
          <CardTitle>Courier Registration</CardTitle>
          <CardDescription>
            Please fill out the form to register as a courier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-6">
          <div className="space-y-3">
            <Label htmlFor="name">Name</Label>
            <Input
              {...form.register("name")}
              defaultValue={user?.user_metadata.full_name}
              type="text"
              id="name"
              placeholder="Enter your name"
            />
            {form.formState.errors.name && (
              <span className="text-destructive">{form.formState.errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <Input
              {...form.register("email")}
              defaultValue={user?.email}
              type="email"
              id="email"
              placeholder="Enter your email"
            />
            {form.formState.errors.email && (
              <span className="text-destructive">{form.formState.errors.email.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="phone">Phone</Label>
            <Input
              {...form.register("phone")}
              defaultValue={user?.phone}
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
            />
            {form.formState.errors.phone && (
              <span className="text-destructive">{form.formState.errors.phone.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="area">Area</Label>
            <Input
              {...form.register("area")}
              type="text"
              id="area"
              placeholder="Enter your area"
            />
            {form.formState.errors.area && (
              <span className="text-destructive">{form.formState.errors.area.message}</span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
