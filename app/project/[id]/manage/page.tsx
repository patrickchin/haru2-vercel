import { CenteredLayout, WideLayout } from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { getProject } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { getTaskSpecs } from "@/lib/db";
import { DesignProject, DesignTaskSpec, teamNames } from "@/lib/types";
import { LucideChevronDown, LucideMoveLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

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

  const project: DesignProject | undefined = await getProject(projectId);
  if (project === undefined) notFound();
  const specs: DesignTaskSpec[] = await getTaskSpecs();

  const groupedSpecs: Record<string, DesignTaskSpec[]> = {};
  specs.forEach((spec) => {
    const key: string = spec.type || "other";
    if (!Object.keys(groupedSpecs).includes(key)) groupedSpecs[key] = [];
    groupedSpecs[key].push(spec);
  });

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
        <div className="px-6">
          <h3>Team Member Selection</h3>
        </div>
        <div className="grid grid-cols-2">
          {Object.keys(groupedSpecs).map((key) => (
            <Card className="p-4">{teamNames[key]}</Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="px-6">
          <h3>Team Task Selection</h3>
        </div>
        {Object.keys(groupedSpecs).map((key) => (
          <ManageTeamTasksDropdown
            key={key}
            team={key}
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
