
import { Suspense } from 'react';

import { CenteredLayout } from '@/components/layout';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function ProjectList() {

  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user)
    redirect('/login');

  if (Number.isNaN(userId)) {
    console.log("User id is invalid: ", session);
    return <p>Invalid user</p>;
  }

  return (
    <>

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
          <ProjectList />
        </Suspense>
      </section>
    </CenteredLayout>
  )
}