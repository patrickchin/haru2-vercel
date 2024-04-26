import { Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { getUserProjects } from "@/lib/db";
import { CenteredLayout } from "@/components/page-layouts";

import houseIcon from "@/app/assets/house.png";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

function ProjectItem({ projectUser }: any) {
  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);

  const project = projectUser.projects1;
  const user = projectUser.users1;
  const title = project.title || "Untitled";
  const where = displayNames.of(project.countrycode) || "Unknown Location";
  const type = project.type || "";

  return (
    <Link
      href={`/project/${project.id}`}
      className="flex justify-between gap-6 p-8 border rounded-lg hover:bg-accent"
    >
      <div className="flex min-w-0 gap-x-4">
        {false && (
          <Image
            className="h-12 w-12 flex-none rounded-full"
            src={houseIcon}
            alt="building"
          />
        )}
        <div className="min-w-0 flex-auto">
          <p className="text-md font-semibold leading-6">
            {title} - {where} - <span className="capitalize">{type}</span>
          </p>
          <p className="mt-1 truncate text-xs leading-5">
            Owner ID: {project.userId} {user.email}
          </p>
          {/* <pre>{JSON.stringify(project, null, 2)} {JSON.stringify(user, null, 2)}</pre> */}
        </div>
      </div>

      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p className="text-sm leading-6 text-gray-900">
          Status: {project.status}
        </p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          Submitted date{" "}
          <time dateTime={project.createdat}>
            {new Date(project.createdat).toLocaleDateString()}{" "}
          </time>
        </p>
      </div>
    </Link>
  );
}

async function ProjectList() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user) redirect("/login");

  if (Number.isNaN(userId)) {
    console.log("User id is invalid: ", session);
    return <p>Invalid user</p>;
  }

  const projects = await getUserProjects(userId);
  return (
    <ul role="list" className="space-y-3">
      {projects.map((p) => (
        <li key={p.projects1.id}>
          <ProjectItem projectUser={p} />
        </li>
      ))}
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
  );
}
