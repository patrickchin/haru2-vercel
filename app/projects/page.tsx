
import { Suspense } from 'react';
import Image from "next/image"
import Link from 'next/link';

import { getProjectsForUser } from '@/lib/db';
import { CenteredLayout } from '@/components/layout';

import houseIcon from "@/app/assets/house.png"
import { auth } from '@/lib/auth';

function ProjectItem({ project } : any) {

  const info = project.info;
  const title = info.title || "Untitled";
  const where = info.country || "Unknown Location";
  const type = info.type || "";

  return (
    <Link href={`/project/${project.id}`} className="flex justify-between gap-6 p-8 border rounded-lg hover:bg-accent">

      <div className="flex min-w-0 gap-x-4">
        {false && <Image className="h-12 w-12 flex-none rounded-full" src={houseIcon} alt="building" />}
        <div className="min-w-0 flex-auto">
          <p className="text-md font-semibold leading-6">{title} - {where} - {type}</p>
          <p className="mt-1 truncate text-xs leading-5">Owner ID: {project.userId} example@haru.com</p>
          {/* {JSON.stringify(project)} */}
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
    console.log("User id is invalid: ", session);
    return <p>Invalid user</p>;
  }

  const projects = await getProjectsForUser(userId);
  return (
    <ul role="list" className="space-y-3">
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
    <CenteredLayout>
      <section className="grow flex flex-col gap-12">
        <h3>My Projects</h3>
        <Suspense fallback={<p>Loading ...</p>}>
          <ProjectList />
        </Suspense>
      </section>
    </CenteredLayout>
  )
}