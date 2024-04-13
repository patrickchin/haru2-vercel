"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

import { getProjectTasks } from "../data/tasks" // todo put in actions.ts

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TaskTable from "./task-table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { LucideChevronDown } from "lucide-react"





function TeamProgress({ project, team }: any) {

  const total = team.completed + team.inprogress + team.pending;
  const pct = 100 * team.completed / total;
  const col = pct < 30 ? "bg-teal-300" :
    pct < 80 ? "bg-emerald-300" : "bg-green-300";

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between gap-8 p-8">
        <CardTitle>
          {team.name}
        </CardTitle>
        {/* can't do the colors programatically with tailwind!! */}
        <Progress value={pct} indicatorColor={col} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Collapsible className="space-y-4">
          <CollapsibleTrigger className="flex justify-between gap-8 w-full p-4 justify-start text-start font-semibold text-sm rounded-md hover:bg-accent">
            <span>Completed {team.completed} of {total} total tasks ({pct.toFixed(0)} %)</span>
            <span className="flex flex-row gap-2 items-center">Expand for details <LucideChevronDown/></span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <TaskTable projectid={project.id} data={team.tasks} />
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

export default function ProjectTeamsProgress({ project }: { project: any }) {

  // const allTasks = getProjectTasks(0);
  // It's not a db function yet ... will get hard once it is
  // will probably have to move this call to the calling code as this is a client component
  const allTasks = getProjectTasks(0);

  const legalTasks = allTasks.filter((task) => task.type == "legal");
  const architecturalTasks = allTasks.filter((task) => task.type == "architectural");
  const structuralTasks = allTasks.filter((task) => task.type == "structural");
  const mepTasks = allTasks.filter((task) => task.type == "mep");
  const otherTasks = allTasks.filter((task) => task.type == "other");

  // TODO actually put the above information into this array
  const progressValues = [
    { name: "Legal", completed: 20, inprogress: 4, pending: 0, tasks: legalTasks },
    { name: "Architectural", completed: 23, inprogress: 1, pending: 0, tasks: architecturalTasks },
    { name: "Structural", completed: 5, inprogress: 3, pending: 20, tasks: structuralTasks },
    { name: "Mechanical, Electrical and Plumbing", completed: 3, inprogress: 1, pending: 17, tasks: mepTasks },
  ]

  return (
    <div className="flex flex-col space-y-4">
      {progressValues.map((team, i) => <TeamProgress key={i} project={project} team={team} />)}
    </div>
  );
}