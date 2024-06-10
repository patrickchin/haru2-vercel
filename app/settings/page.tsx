"use client";

import { ChangeEvent, useState } from "react";
import assert from "assert";
import { useSession } from "next-auth/react";
import { updateAvatarForUser } from "@/lib/actions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CenteredLayout } from "@/components/page-layouts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrentUserAvatar } from "@/components/user-avatar";

function SettingsPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setUpLoading] = useState(false);

  async function onChangeAvatar(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;

    setUpLoading(true);

    assert(targetFiles.length >= 1);
    const file = targetFiles.item(0);
    
    if (!file) {
      return;
    }
    
    const response = await fetch("/api/upload/avatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
  
    const { url, fileUrl, fields } = await response.json();
  
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("file", file);
  
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });
  
    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    const updatedUser = await updateAvatarForUser(fileUrl);

    if (updatedUser) {
      window.location.reload();
    } else {
      setErrorMessage("Failed to update the avatar. Please try again.");
    }

    e.target.value = "";
    setUpLoading(false);
  }

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
