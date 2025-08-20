"use client"
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

const RegisterForm = () => {
  const form = useForm();

  
  return (
    <Card className="min-w-sm max-w-md mx-auto">
      <form>
        <CardHeader>
          <CardTitle>Courier Registration</CardTitle>
          <CardDescription>
            Please fill out the form to register as a courier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-6">
          <div className="space-y-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Enter your phone number" />
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
