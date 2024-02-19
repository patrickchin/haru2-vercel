import { Suspense } from 'react';

import SimpleLayout from '@/components/layout';
import { getJobsForUser as getJobsForUser } from '@/lib/db';
import { auth } from '@/lib/auth';

async function Dashboard() {
  const session = await auth();

  if (!session?.user)
    return (<p>Not logged in.</p>);

  if (session?.user?.id) {
    const userId = Number(session?.user?.id);
    const currentUserJobs = await getJobsForUser(userId);
    return JSON.stringify(currentUserJobs);
  }

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
