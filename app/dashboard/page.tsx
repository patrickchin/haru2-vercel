import { Suspense } from 'react';

import SimpleLayout from '@/components/layout';
import { getProjectsForUser } from '@/lib/db';
import { auth } from '@/lib/auth';

async function Dashboard() {
  const session = await auth();

  if (!session?.user)
    return (<p>Not logged in.</p>);

  if (session?.user?.id) {
    const userId = Number(session?.user?.id);
    const currentUserProjects = await getProjectsForUser(userId);
    return JSON.stringify(currentUserProjects);
  }

  return null;
}

export default async function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <h2 className="scroll-m-20 border-b pb-2 px-12 text-3xl font-semibold tracking-tight first:mt-0">
          Dashboard
        </h2>
        <Suspense fallback={<p>Loading ...</p>}>
          <Dashboard />
        </Suspense>
      </section>
    </SimpleLayout>
  );
}
