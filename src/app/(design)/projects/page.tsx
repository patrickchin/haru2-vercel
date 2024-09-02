import { Suspense, useMemo } from "react";
import Link from "next/link";

import { getCurrentUsersProjects } from "@/lib/actions";
import { CenteredLayout } from "@/components/page-layouts";

import { DesignProjectUser } from "@/lib/types";

function ProjectItem({ project }: { project: DesignProjectUser }) {
  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);

  const user = project.user;
  const title = project.title || "Untitled";
  const where =
    (project.countryCode && displayNames.of(project.countryCode)) ||
    "Unknown Location";
  const type = project.type || "";

  return (
    <Link
      href={`/project/${project.id}`}
      className="flex justify-between gap-6 p-8 border rounded-lg hover:bg-accent"
    >
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-md font-semibold leading-6">
            {title} - {where} - <span className="capitalize">{type}</span>
          </p>
          <p className="mt-1 truncate text-xs leading-5">
            Owner ID: {user?.id} {user?.name}
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
          {project.createdAt && (
            <time dateTime={project.createdAt.toISOString()}>
              {project.createdAt.toLocaleDateString()}{" "}
            </time>
          )}
        </p>
      </div>
    </Link>
  );
}

async function ProjectList() {
  const projects = await getCurrentUsersProjects();
  return (
    <ul role="list" className="space-y-3">
      {projects?.map((p) => (
        <li key={p.id}>
          <ProjectItem project={p} />
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
