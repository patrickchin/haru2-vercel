"use client";

import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

import { CenteredLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createDefaultTaskSpecs } from '@/lib/actions';

async function SettingsPage() {

  const session = await useSession();
  const userId = Number(session.data?.user?.id);

  if (!session.data?.user)
    redirect('/login');

  if (Number.isNaN(userId)) {
    console.log("User id is invalid: ", session);
    return <p>Invalid user</p>;
  }

  return (
    <>

      <Card>
        <CardHeader>
          <CardTitle>
            Dev Area
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button variant="secondary" onClick={() => createDefaultTaskSpecs()}>Upload default task spec</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          Contact information
        </CardHeader>
        <CardContent>
          <p> Phone numbers </p>
          <p> Emails </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          Information
        </CardHeader>
        <CardContent>
          <p>Change Password</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          Destruction
        </CardHeader>
        <CardContent>
          <p>Delete User</p>
        </CardContent>
      </Card>

    </>
  );
}

export default async function Page() {
  return (
    <CenteredLayout>
      <section className="grow flex flex-col gap-12">
        <h3>Settings</h3>
        <Suspense fallback={<p>Loading ...</p>}>
          <SettingsPage />
        </Suspense>
      </section>
    </CenteredLayout>
  )
}