"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { CenteredLayout } from "@/components/page-layouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SettingsPage() {
  const session = useSession();
  const userId = Number(session.data?.user?.id);

  if (!session.data?.user) redirect("/login");

  if (Number.isNaN(userId)) {
    console.log("User id is invalid: ", session);
    return <p>Invalid user</p>;
  }

  return (
    <>
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
