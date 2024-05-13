"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { CenteredLayout } from "@/components/page-layouts";
import { updateAvaterForUser } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials } from "@/lib/utils";

function SettingsPage() {
  const { data: session } = useSession();
  if (!session?.user) redirect("/login");

  const userId = Number(session?.user?.id);
  if (Number.isNaN(userId)) return <p>Invalid user</p>;

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 250000) return; // TODO show error

    const response = new FormData();
    response.set("file", file);
    const updatedAvatarUrl = await updateAvaterForUser(response);
    // TODO update user avatar image everywhere
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="col-span-6 ml-2 sm:col-span-4 md:mr-3">
            <Input
              type="file"
              className="hidden"
              id="photo"
              onChange={handleFileChange}
              accept="image/*"
            />
            <Label className="block text-gray-700 text-sm font-bold mb-2 text-center">
              Profile Photo
            </Label>

            <div className="text-center">
              <div className="mt-2">
                <div className="flex justify-center items-center w-full h-full">
                  <Avatar className="w-40 h-40 rounded-full bg-cover bg-no-repeat bg-center">
                    {/* // TODO setState(getUser().avatarUrl) */}
                    <AvatarImage src={} />
                    <AvatarFallback>
                      {getAvatarInitials("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <Label
                htmlFor="photo"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3 cursor-pointer"
              >
                Select New Photo
              </Label>
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
