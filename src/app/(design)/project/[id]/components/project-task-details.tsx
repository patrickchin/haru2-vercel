"use client";

import { Card, CardContent } from "@/components/ui/card";

import { DesignTask } from "@/lib/types";
import { DesignProject } from "@/lib/types";
import TaskTable from "./task-table";

export function ProjectTaskDetailsSkeleton() {
  return <div className="flex flex-col space-y-4">Loading Tasks ...</div>;
}

export default function ProjectTaskDetails({
  project,
  tasks,
}: {
  project: DesignProject;
  tasks: DesignTask[];
}) {
  return (
    <Card>
      <CardContent className="pt-8">
        <TaskTable
          projectId={project.id}
          data={tasks}
          pageSize={8}
          showTypeColumn={true}
          showFilterToggles={true}
        />
      </CardContent>
    </Card>
  );
}
