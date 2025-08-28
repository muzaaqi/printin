"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatter/datetime";
import ProfileForm from "./profile-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, profileSchema } from "@/lib/schema/profile";
import { Camera, Loader2 } from "lucide-react";
import { updateProfile } from "@/hooks/profile/update-profile";
import { cropToSquare } from "@/hooks/profile/crop-avatar";
import { toast } from "sonner";

const ProfileCard = ({ user }: { user: User | null }) => {
  const [isEdit, setEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
  });

  const handleFileSelect = async (file: File) => {
    try {
      const cropped = await cropToSquare(file);
      setUploadedFile(cropped);

      const data = new DataTransfer();
      data.items.add(cropped);
      form.setValue("avatar", data.files);
      form.clearErrors("avatar");
    } catch (err) {
      console.error("Crop failed:", err);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileSchema) => {
    setLoading(true);
    const res = await updateProfile(data);
    if (res.success) {
      toast.success("Profil berhasil diperbarui", {
        position: "top-center",
      });
      setEdit(false);
      form.reset();
    } else if (!res.success) {
      toast.error("Gagal memperbarui profil", {
        position: "top-center",
        description: res.error,
      });
    }
    setLoading(false);
  };
  return (
    <Card className="items-center justify-center p-5">
      <Form {...form}>
        <form
          id="profile-update-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <>
            <CardHeader className="grid items-center justify-center">
              <div className="text-muted-foreground hover:text-foreground mx-auto w-fit rounded-full border-2 p-1 transition-colors">
                {isEdit ? (
                  <>
                    <div
                      className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full"
                      onClick={handleClick}
                    >
                      {uploadedFile ? (
                        <Image
                          src={URL.createObjectURL(uploadedFile)}
                          alt="Uploaded Image"
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Image
                            src={
                              user?.user_metadata?.avatar_url ||
                              "/default_avatar.svg"
                            }
                            width={100}
                            height={100}
                            alt="Profile Picture"
                            className="rounded-full opacity-30"
                          />
                          <Camera size={40} className="absolute" />
                        </div>
                      )}
                    </div>
                    <Input
                      ref={fileInputRef}
                      id="upload-file"
                      type="file"
                      className="hidden"
                      capture="user"
                      accept="image/*"
                      onChange={handleFileInputChange}
                    />
                  </>
                ) : (
                  <Image
                    src={
                      user?.user_metadata?.avatar_url || "/default_avatar.svg"
                    }
                    width={100}
                    height={100}
                    alt="Profile Picture"
                    className="rounded-full"
                  />
                )}
              </div>
              {form.formState.errors.avatar && (
                <FormMessage className="text-center">
                  {form.formState.errors.avatar.message?.toString()}
                </FormMessage>
              )}
              <div className="mt-4 text-center">
                {isEdit ? (
                  <>
                    <Input
                      {...form.register("full_name")}
                      defaultValue={user?.user_metadata?.full_name || ""}
                      className="w-fit"
                    />
                    <FormMessage>
                      {form.formState.errors.full_name?.message?.toString()}
                    </FormMessage>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold">
                      {user?.user_metadata?.full_name || "Unknown User"}
                    </h2>
                    <Button
                      onClick={() => setEdit(true)}
                      className="mt-2 text-xs"
                      variant="outline"
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="w-full space-y-2 rounded-lg border p-4">
              {isEdit ? (
                <ProfileForm user={user} form={form} />
              ) : (
                <>
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
                </>
              )}
            </CardContent>
            {isEdit && (
              <CardFooter className="grid w-full grid-cols-2 gap-4 px-0.5">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    setEdit(false);
                    form.reset();
                    setUploadedFile(null);
                  }}
                >
                  Batal
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild className="w-full">
                    <Button
                      disabled={isLoading}
                      type="button"
                      className="w-full text-xs"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Simpan"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Semua data yang kamu masukkan akan dikirim. Pastikan
                        sudah benar.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
                      <Button
                        type="submit"
                        form="profile-update-form"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Konfirmasi"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            )}
          </>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileCard;
