import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import * as Actions from "@/lib/actions";
import { auth } from "@/lib/auth";

import { CenteredLayout } from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { ManageTeamMembers } from "./components/manage-team-members";
import StartProjectButton from "./components/start-project-button";
import { LucideMoveLeft } from "lucide-react";
import ManageTeamTasksDropdown from "./components/manage-team-tasks";

async function ProjectManagement({ projectId }: { projectId: number }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [project, specs, teams] = await Promise.all([
    Actions.getProject(projectId),
    Actions.getProjectTaskSpecsGroupedByTeam(),
    Actions.getProjectTeams(projectId),
  ]);

  if (project === undefined) notFound();
  if (teams === undefined) notFound();

  return (
    <>
      <section className="flex gap-4 items-center">
        <Button asChild variant="secondary" className="shadow-md">
          <Link href={`/project/${projectId}`}>
            <LucideMoveLeft />
          </Link>
        </Button>
        <h3 className="grow">
          Project {project.id} - {project.title || session.user.email}
        </h3>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex justify-between px-6">
          <h3>Team Member Selection</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {teams.map((team) => (
            <ManageTeamMembers key={team.id} team={team} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="px-6">
          <h3>Team Task Selection</h3>
        </div>
        {Object.keys(specs).map((team) => (
          <ManageTeamTasksDropdown
            key={team}
            team={team}
            groupedSpecs={specs}
          />
        ))}
      </section>

      <section className="flex justify-end">
        <StartProjectButton projectId={projectId} />
      </section>
    </>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const projectId: number = parseInt(params.id);
  if (Number.isNaN(projectId)) {
    redirect("/project/not-found");
  }

  return (
    <CenteredLayout>
      <Suspense fallback={<p>Loading ...</p>}>
        <ProjectManagement projectId={projectId} />
      </Suspense>
    </CenteredLayout>
  );
}
