"use client";

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { changePasswordSchema, ChangePasswordType } from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadAvatarFile } from "@/lib/utils/upload";
import * as Actions from "@/lib/actions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideLoader2 } from "lucide-react";
import { DefaultLayout } from "@/components/page-layouts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrentUserAvatar } from "@/components/user-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SaveRevertForm } from "@/components/save-revert-form";

function ChangePassword() {
  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (d) => {
          const ret = await Actions.updateUserPassword(d);
          if (ret?.error) {
            form.setError("root", { message: ret.error });
          } else {
            form.reset();
          }
        })}
        className="w-full max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormMessage>{form.formState.errors.root?.message}</FormMessage>

        <div className="col-span-2 flex justify-end">
          <SaveRevertForm form={form} />
        </div>
      </form>
    </Form>
  );
}

function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setUpLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetcher = (arg: string) => fetch(arg).then((res) => res.json());
  const { data: user } = useSWR(`/api/me`, fetcher);

  async function onChangeAvatar(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;
    try {
      setUpLoading(true);
      const file = targetFiles.item(0);
      if (!file) return;
      const updatedUser = await uploadAvatarFile(file);
      if (!updatedUser)
        setErrorMessage("Failed to update the avatar. Please try again.");
      await updateSession({});
    } finally {
      e.target.value = "";
      setUpLoading(false);
    }
  }

  const deleteProfileAvatar = async () => {
    setIsDeleting(true);
    try {
      await Actions.updateAvatarForUser(null);
      await updateSession({});
    } catch (error) {
      console.error("Error deleting avatar:", error);
    } finally {
      setIsDeleting(false);
    }
    location.reload();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile picture</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center justify-center">
          <CurrentUserAvatar className="w-32 h-32 rounded-full outline outline-offset-4" />

          {errorMessage && (
            <p className="text-destructive text-xs italic text-center">
              {errorMessage}
            </p>
          )}

          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={!session?.user?.image || isDeleting}
                >
                  Delete
                  {isDeleting && <LucideLoader2 className="animate-spin h-4" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteProfileAvatar}>
                    Yes, Delete
                    {isDeleting && (
                      <LucideLoader2 className="animate-spin h-4" />
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Label
              htmlFor="select-avatar"
              className="cursor-pointer inline-flex"
            >
              <Input
                type="file"
                className="hidden"
                id="select-avatar"
                onChange={onChangeAvatar}
                accept="image/*"
                disabled={isUploading}
              />
              <Button variant="outline" disabled={isUploading}>
                Select New Photo
                {isUploading && <LucideLoader2 className="animate-spin" />}
              </Button>
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Account Id</TableHead>
                <TableCell>{user?.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Signup Date</TableHead>
                <TableCell>
                  <time dateTime={user?.createdAt}>
                    {new Date(user?.createdAt).toLocaleString()}
                  </time>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableCell>{user?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableCell>{user?.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Account Role</TableHead>
                <TableCell>{user?.role}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <ChangePassword />
        </CardContent>
      </Card>
    </>
  );
}

export default function Page() {
  return (
    <DefaultLayout>
      <h1>Settings</h1>
      <SettingsPage />
    </DefaultLayout>
  );
}
