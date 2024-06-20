import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import * as Actions from "@/lib/actions";
import { auth } from "@/lib/auth";

import { LucideMoveLeft } from "lucide-react";
import { CenteredLayout } from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import ManageAllTeamsMembers from "./components/manage-team-members";
import ManageAllTeamsTasks from "./components/manage-team-tasks";

async function ProjectManagement({ projectId }: { projectId: number }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const project = await Actions.getProject(projectId);
  if (project === undefined) notFound();

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

      <ManageAllTeamsMembers projectId={project.id} />
      <ManageAllTeamsTasks projectId={project.id} />

      <form action={Actions.startProjectForm} className="flex justify-end">
        <input type="hidden" name="projectId" value={project.id} />
        <Button type="submit" size="lg">
          Save
        </Button>
      </form>
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
