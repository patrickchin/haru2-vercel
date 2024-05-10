"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { CenteredLayout } from "@/components/page-layouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createDefaultTaskSpecs, updateAvaterForUser } from "@/lib/actions";
import { cn } from "@/lib/utils";

function SettingsPage() {
  const session = useSession();
  const userId = Number(session.data?.user?.id);
  const [photoName, setPhotoName] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      setPhotoName(file.name);
      //preview the image
      // const reader = new FileReader();
      // reader.onload = (e: any) => {
      //   setPhotoPreview(e.target.result);
      // };
      // reader.readAsDataURL(file);
      // server action arguments can only be primatives or FormData
      const data = new FormData();
      data.set("file", file);
      const newFile = await updateAvaterForUser(data);
      console.log("newFiles:", newFile);
      event.target.value = "";
      setIsUploading(false);
      // if (newFiles) setUpdatedFiles(newFiles);
    }
  };

  if (!session.data?.user) redirect("/login");

  if (Number.isNaN(userId)) {
    console.log("User id is invalid: ", session);
    return <p>Invalid user</p>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="col-span-6 ml-2 sm:col-span-4 md:mr-3">
            <input
              type="file"
              className="hidden"
              id="photo"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-center"
              htmlFor="photo"
            >
              Profile Photo
            </label>
            <div className="text-center">
              <div className="mt-2">
                {photoPreview ? (
                  <div
                    style={{
                      width: "160px",
                      height: "160px",
                      borderRadius: "9999px",
                      backgroundImage: `url(${photoPreview})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      margin: "auto",
                    }}
                  ></div>
                ) : (
                  <div
                    style={{
                      width: "160px",
                      height: "160px",
                      borderRadius: "9999px",
                      backgroundImage: `url(https://images.unsplash.com/photo-1531316282956-d38457be0993?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80)`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      margin: "auto",
                    }}
                  ></div>
                )}
              </div>
              <label
                htmlFor="photo"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3 cursor-pointer"
              >
                Select New Photo
              </label>
            </div>
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
