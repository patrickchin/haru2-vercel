"use client"

import * as React from "react"
import TaskTable from "./task-table"
import { LucideChevronDown, LucideListCollapse } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { DesignTask } from '@/lib/types'
import { DesignProject } from '@/lib/types'

const teamNames: Record<string, string> = {
  legal: "Legal",
  architectural: "Architectural",
  structural: "Structural",
  mep: "Mechanical, Electrical and Plumbing",
  other: "Other",
};

function TeamProgress({ project, team, tasks }: {
  project: DesignProject,
  team: string,
  tasks: DesignTask[],
}) {

  tasks = tasks.filter((task) => task.type == team);

  const completed = tasks.reduce((n, t) => (t.status === "completed" ? n + 1 : n), 0)
  const total = tasks.length;
  const pct = total ? 100 * completed / total : 0;
  // const col = pct < 30 ? "bg-teal-300" :
  //   pct < 80 ? "bg-emerald-300" : "bg-green-300";
  const col = "bg-blue-400"

  return (
    <Card>
      <CardHeader className="flex flex-row gap-8 p-8 items-end">
        <div className="flex w-1/2 gap-4 items-end">
          <CardTitle>{teamNames[team]}</CardTitle>
          <span className="text-sm">Team Lead: </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* <div className="flex justify-center">
          <Progress className="w-1/3 h-2" value={pct} indicatorColor={col} />
        </div> */}
        <Collapsible className="space-y-4">
          <CollapsibleTrigger className="flex justify-between gap-8 w-full p-4 justify-start text-start font-semibold text-sm rounded-md hover:bg-accent">
            <span className="flex gap-2 items-center">
              <LucideListCollapse className="fg-mited h-5"/>
              <span>Completed {completed} of {total} total tasks ({pct.toFixed(0)} %)</span>
            </span>
            <span className="flex flex-row gap-2 items-center">
              {/* Expand for details */}
              <LucideChevronDown className="h-5"/></span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <TaskTable projectid={project.id} data={tasks} />
          </CollapsibleContent>
        </Collapsible>

      </CardContent>
    </Card>);
}

export function ProjectTeamsProgressSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      Loading ...
    </div>
  );
}

export default function ProjectTeamsProgress({ project, tasks }: { project: DesignProject, tasks: DesignTask[] }) {

   const teams = [ "legal", "architectural", "structural", "mep", "other" ];

  return (
    <div className="flex flex-col space-y-4">
      {teams.map((team, i) => <TeamProgress key={team} project={project} team={team} tasks={tasks} />)}
    </div>
  );
}