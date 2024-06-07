"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { deleteAvatarForUser, updateAvatarForUser } from "@/lib/actions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CenteredLayout } from "@/components/page-layouts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrentUserAvatar } from "@/components/user-avatar";
import DeleteAlertDialog from "@/components/delete-alert";

function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setUpLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      setErrorMessage("Please select a file.");
      return;
    }

    if (file.size > 250000) {
      setErrorMessage(
        "File size is too large. Please upload a file smaller than 250 KB.",
      );
      return;
    }

    setErrorMessage("");
    const data = new FormData();
    data.set("file", file);

    setUpLoading(true);
    const updatedUser = await updateAvatarForUser(data);
    if (updatedUser) {
      // This update doesn't really work
      // const newSession = await updateSession({ user: { image: "update" } });
      // const newSession = await updateSession({ user: { image: updatedUser.avatarUrl } });
      // await updateSession();
    } else {
      setErrorMessage("Failed to update the avatar. Please try again.");
    }
    setUpLoading(false);
    location.reload();
  };

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
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
          <CurrentUserAvatar className="w-40 h-40 rounded-full outline outline-offset-4" />

          {errorMessage && (
            <p className="text-red-500 text-xs italic text-center">
              {errorMessage}
            </p>
          )}
          <div className="flex gap-2">
            <DeleteAlertDialog
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={deleteProfileAvatar}
              isLoading={isDeleting}
              disabled={!session?.user?.image}
              variant="text"
            />
            <Button className="cursor-pointer" asChild variant="outline">
              <Label htmlFor="photo">
                Select New Photo
                {isUploading && <LucideLoader2 className="animate-spin h-4" />}
              </Label>
            </Button>
          </div>
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
