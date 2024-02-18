import { Suspense } from 'react';

import SimpleLayout from '@/app/components/layout';
import { getJobForUser } from '@/app/db';
import { auth } from '@/app/auth';

async function Dashboard() {

  const session = await auth();
  console.log("dashboard session");
  console.log(session);

  if (!session?.user)
    return (<p>Not logged in.</p>);

  // session.id instead of 2
  const currentUserJobs = await getJobForUser(2);

  return null;
}

export default async function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <h1 className="text-3xl">
          Dashboard
        </h1>
        <Suspense fallback={<p>Loading ...</p>}>
          <Dashboard />
        </Suspense>
      </section>
    </SimpleLayout>
  );
}
