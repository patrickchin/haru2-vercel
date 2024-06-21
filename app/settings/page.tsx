"use client";

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CenteredLayout } from "@/components/page-layouts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrentUserAvatar, } from "@/components/user-avatar";
import { uploadAvatar } from "@/lib/utils";
import { deleteAvatarForUser } from "@/lib/actions";

function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setUpLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onChangeAvatar(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;

    setUpLoading(true);
    const file = targetFiles.item(0);
    if (!file) return;
    const updatedUser = await uploadAvatar(file);
    if (updatedUser) {
      location.reload();
    } else {
      setErrorMessage("Failed to update the avatar. Please try again.");
    }
    e.target.value = "";
    setUpLoading(false);
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const deleteProfileAvatar = async () => {
    setIsDeleting(true);
    try {
      await deleteAvatarForUser();
      setIsModalOpen(false);
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
          <Input
            type="file"
            className="hidden"
            id="photo"
            onChange={onChangeAvatar}
            accept="image/*"
            disabled={isUploading}
          />
          <CurrentUserAvatar className="w-40 h-40 rounded-full outline outline-offset-4" />

          {errorMessage && (
            <p className="text-red-500 text-xs italic text-center">
              {errorMessage}
            </p>
          )}

          <Button asChild variant="outline">
            <Label htmlFor="photo">
              Select New Photo
              {isUploading && <LucideLoader2 className="animate-spin h-4" />}
            </Label>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Contact information</CardHeader>
        <CardContent>
          <p> Phone numbers </p>
          <p> Emails </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Information</CardHeader>
        <CardContent>
          <p>Change Password</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Destruction</CardHeader>
        <CardContent>
          <p>Delete User</p>
        </CardContent>
      </Card>
    </>
  );
}

export default function Page() {
  return (
    <CenteredLayout>
      <section className="grow flex flex-col gap-12">
        <h3>Settings</h3>
        <SettingsPage />
      </section>
    </CenteredLayout>
  );
}
