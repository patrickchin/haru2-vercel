"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

import { getProjectTasks } from "../data/tasks" // todo put in actions.ts

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

export function ProjectProgress3Skeleton() {
  return (
    <div className="flex flex-col space-y-4">
      Loading ...
    </div>
  );
}

export default function ProjectProgress3({ project }: { project: any }) {

  // const allTasks = getProjectTasks(0);
  // It's not a db function yet ... will get hard once it is
  // will probably have to move this call to the calling code as this is a client component
  const allTasks = getProjectTasks(0);

  const progressValues = [
    { name: "Legal", completed: 20, total: 24 },
    { name: "Architectural", completed: 23, total: 24 },
    { name: "Structural", completed: 5, total: 24 },
    { name: "Mechanical, Electrical and Plumbing", completed: 3, total: 24 },
  ]

  return (
    <div className="flex flex-col space-y-4">

      {progressValues.map((d, i) =>
        <Card key={i}>
          <CardHeader>{d.name}</CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 justify-center items-center">
                <Progress value={100*d.completed/d.total} className="w-5/6" indicatorColor={`bg-green-300`} />
              </div>
              <CardDescription>
                Completed {d.completed} of {d.total} total tasks ({(100*d.completed/d.total+8).toFixed(0)} %)
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}