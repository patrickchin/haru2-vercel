import { CenteredLayout, WideLayout } from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import * as Actions from "@/lib/actions";
import { auth } from "@/lib/auth";
import { getTaskSpecs } from "@/lib/db";
import { DesignProject, DesignTaskSpec, DesignTeam, DesignTeamMember, teamNames } from "@/lib/types";
import { LucideChevronDown, LucideMoveLeft, LucidePlus } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ManageTeamMembers } from "./components/manage-team-members";
import AddTeamMemberButton from "./components/manage-team-add-team";

function ManageTeamTasks({
  team,
  groupedSpecs,
}: {
  team: string;
  groupedSpecs: Record<string, DesignTaskSpec[]>;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 justify-center">
      {groupedSpecs[team].map((taskSpec, i) => (
        <Label
          key={i}
          htmlFor={`taskspec-${team}-${i}`}
          className="flex justify-between gap-4 items-center py-4 px-6 border rounded-md font-normal"
        >
          <div className="space-y-2">
            <h5>{taskSpec.title}</h5>
            <div className="text-xs">{taskSpec.description}</div>
          </div>
          <div>
            <Checkbox id={`taskspec-${team}-${i}`} />
            {/* <Button variant="outline" className="p-1">
                    <LucidePlus className="h-5" />
                  </Button> */}
          </div>
        </Label>
      ))}
    </div>
  );
}

function ManageTeamTasksDropdown({
  team,
  groupedSpecs,
}: {
  team: string;
  groupedSpecs: Record<string, DesignTaskSpec[]>;
}) {
  return (
    <Card>
      <Collapsible
        className="grow"
        // defaultOpen={isOpen}
      >
        <CollapsibleTrigger className="flex gap-4 w-full p-8 text-sm hover:bg-accent">
          <CardTitle className="text-left">{teamNames[team]}</CardTitle>
          <span>(No assigned lead)</span>
          <LucideChevronDown className="h-5" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-12 py-6">
          <ManageTeamTasks team={team} groupedSpecs={groupedSpecs} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

async function ProjectManagement({ projectId }: { projectId: number }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const project: DesignProject | undefined = await Actions.getProject(projectId);
  if (project === undefined) notFound();
  // TODO should be an Action rather than a db call
  const specs: DesignTaskSpec[] = await getTaskSpecs();

  // TODO this can be done server side
  const groupedSpecs: Record<string, DesignTaskSpec[]> = {};
  specs.forEach((spec) => {
    const key: string = spec.type || "other";
    if (!Object.keys(groupedSpecs).includes(key)) groupedSpecs[key] = [];
    groupedSpecs[key].push(spec);
  });

  const teams: DesignTeam[] = await Actions.getProjectTeams(projectId) || [];

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
          <AddTeamMemberButton projectId={projectId}/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {teams.map((team) => (
            <ManageTeamMembers key={team} team={team} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="px-6">
          <h3>Team Task Selection</h3>
        </div>
        {Object.keys(groupedSpecs).map((team) => (
          <ManageTeamTasksDropdown
            key={team}
            team={team}
            groupedSpecs={groupedSpecs}
          />
        ))}
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
