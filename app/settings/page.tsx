"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getCurrentUser, updateAvaterForUser } from "@/lib/actions";
import { cn, getAvatarInitials } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CenteredLayout } from "@/components/page-layouts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LucideLoader2 } from "lucide-react";
import { DesignUserBasic } from "@/lib/types";

function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setUpLoading] = useState(false)
  const [user, setUser] = useState<DesignUserBasic | null>(null)

  if (!session?.user) redirect("/login");

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const users = await getCurrentUser();
        if(users && users.length > 0){
          setUser(users[0]); // Set the user in state if needed
        }else {
          console.error('No users returned');
          setUser(null);  // Handle the case where no users are returned
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);  
      }
    };
    fetchData(); // Call the async function
  },[])

  const userId = Number(session?.user?.id);
  if (Number.isNaN(userId)) return <p>Invalid user</p>;

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      setErrorMessage('Please select a file.');
      return;
    }

    if (file.size > 250000) {
      setErrorMessage('File size is too large. Please upload a file smaller than 250 KB.');
      return;
    } 

    setErrorMessage('')
    const data = new FormData();
    data.set("file", file);

    try {
      setUpLoading(true)
      const updatedUser = await updateAvaterForUser(data);
      if(updatedUser){
        setUser(updatedUser)
        setUpLoading(false)
      }else{
        setUser(null); // Optionally handle as an error or set to null
        setUpLoading(false)
      }
      router.refresh();
    } catch (error) {
      setErrorMessage('Failed to update the avatar. Please try again.');
      setUpLoading(false)
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
              disabled={isUploading}
            />
            <Label className="block text-gray-700 text-sm font-bold mb-2 text-center">
              Profile Photo
            </Label>
            {errorMessage && (
              <p className="text-red-500 text-xs italic text-center">{errorMessage}</p>
            )}

            <div className="text-center">
              <div className="mt-2">
                <div className="flex justify-center items-center w-full h-full">
                  <Avatar className="w-40 h-40 rounded-full bg-cover bg-no-repeat bg-center">
                    {/* TODO setState(getCurrentUser().avatarUrl) */}
                    {(user && user.avatarUrl) ?
                      <AvatarImage src={user?.avatarUrl} />:
                      <AvatarFallback>{getAvatarInitials(user?.name)}</AvatarFallback>
                    }
                  </Avatar>
                </div>
              </div>
              <Label
                htmlFor="photo"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3 cursor-pointer"
              >
                Select New Photo
                {isUploading &&
                  <LucideLoader2
                    className={cn("animate-spin h-4")}
                  />
                }
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
