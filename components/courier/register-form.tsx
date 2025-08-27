"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courierRegisterSchema,
  CourierRegisterSchema,
} from "@/lib/schema/courier-register";
import { User } from "@supabase/supabase-js";
import { handleCourierRegister } from "@/features/courier-register";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const RegisterForm = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<CourierRegisterSchema>({
    resolver: zodResolver(courierRegisterSchema),
  });

  const onSubmit = async (data: CourierRegisterSchema) => {
    setLoading(true);
    const res = await handleCourierRegister(user.id, data);
    if (res.success) {
      setLoading(false);
      setOpen(true);
      form.reset();
    } else if (!res.success) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.", {
        description: <p>{res.error?.message}</p>,
        className: "text-destructive",
      });
    }
  };

  return (
    <>
      <Card className="mx-auto max-w-md min-w-sm">
        <form id="courier-registration-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                <span className="text-destructive">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled
                {...form.register("email")}
                defaultValue={user?.email}
                type="email"
                id="email"
                placeholder="Enter your email"
              />
              {form.formState.errors.email && (
                <span className="text-destructive">
                  {form.formState.errors.email.message}
                </span>
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
                <span className="text-destructive">
                  {form.formState.errors.phone.message}
                </span>
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
                <span className="text-destructive">
                  {form.formState.errors.area.message}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild className="w-full">
                <Button disabled={loading} className="w-full" type="button">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua data yang kamu masukkan akan dikirim. Pastikan sudah
                    benar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      type="submit"
                      form="courier-registration-form"
                      disabled={loading}
                    >
                      Konfirmasi
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </form>
      </Card>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Berhasil Mendaftar!</AlertDialogTitle>
            <AlertDialogDescription>
              Silahkan menunggu konfirmasi dari admin. Kami akan menghubungi
              Anda melalui email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setOpen(false);
                redirect("/me");
              }}
            >
              Oke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RegisterForm;
