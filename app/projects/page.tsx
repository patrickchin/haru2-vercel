
import { Suspense } from 'react';
import Image from "next/image"
import Link from 'next/link';

import { getProjectsForUser } from '@/lib/db';
import SimpleLayout from '@/components/layout';

import houseIcon from "@/app/assets/house.png"
import { auth } from '@/lib/auth';

function ProjectItem({ project } : any) {
  return (
    <Link href={`/project/${project.id}`} className="flex justify-between gap-x-6 p-8 hover:bg-gray-300">

      <div className="flex min-w-0 gap-x-4">
        {false && <Image className="h-12 w-12 flex-none rounded-full" src={houseIcon} alt="building" />}
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">Project ID: {project.id} - Kenya - 2 Story building</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">Owner ID: {project.userId} example@haru.com</p>
          {JSON.stringify(project)}
        </div>
      </div>

      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p className="text-sm leading-6 text-gray-900">
          Status: pending
        </p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          Last updated <time dateTime="2023-01-23T13:23Z">3h ago</time>
        </p>
      </div>

    </Link>
  )
}

async function ProjectList() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (Number.isNaN(userId)) {
    console.log("User id is not a number: ", session);
    return <p>invalid user</p>;
  }

  const projects = await getProjectsForUser(userId);
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {projects.reverse().map((project) =>
        <li key={project.id}>
          <ProjectItem project={project} />
        </li>
      )}
    </ul>
  );
}

export default async function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        
        <h1 className="text-3xl">
          List of Available Projects
        </h1>

        <Suspense fallback={<p>Loading ...</p>}>
          <ProjectList />
        </Suspense>
        
      </section>
    </SimpleLayout>
  )
}