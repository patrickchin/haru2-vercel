"use client";

import { LucideChevronDown } from "lucide-react";
import useSWR from "swr";

import { DesignTask, DesignTaskSpec, DesignTeam, teamNames } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";

function TaskCheckBox({
  projectId,
  spec,
  task,
}: {
  projectId: number;
  spec?: DesignTaskSpec;
  task?: DesignTask;
}) {
  if (!task) return null;
  const label = `taskid-${task.id}`;

  return (
    <Label
      htmlFor={label}
      className="flex justify-between gap-4 items-center py-4 px-6 border rounded-md font-normal"
    >
      <div className="space-y-2">
        <h5>{task.title}</h5>
        <div className="text-xs">{task.description}</div>
      </div>
      <div>
        <Checkbox
          id={label}
          defaultChecked={task.enabled ?? true}
          onCheckedChange={(checked) => {
            if (!projectId) return;
            // TODDO checked can be a string??
            Actions.enableProjectTask(task.id, checked == true);
          }}
          className="h-4 w-4"
        />
      </div>
    </Label>
  );
}

function ManageTeamTasks({
  team,
  specs,
  tasks,
}: {
  team: DesignTeam;
  specs: DesignTaskSpec[];
  tasks: DesignTask[];
}) {
  const projectId = team.projectid;
  if (!team.type) return null;
  if (!specs) return null;
  if (!projectId) return null;

  // specs or tasks?? or join them??

  tasks?.sort((task) => task.id);

  return (
    <div className="grid grid-cols-2 gap-4 justify-center">
      {tasks
        .sort((a, b) => {
          return a.id - b.id;
        })
        .map((task, i) => (
          <TaskCheckBox key={i} projectId={projectId} task={task} />
        ))}
    </div>
  );
}

export default function ManageAllTeamsTasks({
  projectId,
}: {
  projectId: number;
}) {
  const {
    data: teams,
    error: teamsError,
    mutate: teamsMutate,
  } = useSWR(`/api/project/${projectId}/teams`, () => {
    return Actions.getProjectTeams(projectId);
  });

  const {
    data: specs,
    error: specsError,
    mutate: specsMutate,
  } = useSWR(`/api/specs/grouped`, () => {
    return Actions.getProjectTaskSpecsGroupedByTeam();
  });

  const {
    data: tasks,
    error: tasksError,
    mutate: tasksMutate,
  } = useSWR(`/api/project/${projectId}/tasks`, () => {
    return Actions.getProjectTasksAll(projectId);
  });

  if (!specs) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="px-6">
        <h3>Team Task Selection</h3>
      </div>

      {teams?.map((team) => {
        // this seems very flimsy
        const teamSpecs = specs[team.type ?? "other"];
        const teamTasks = tasks?.filter((task) => task.type == team.type);
        if (!teamTasks) return null;
        return (
          <Card key={team.id}>
            <Collapsible className="grow">
              <CollapsibleTrigger className="flex gap-4 w-full p-8 text-sm hover:bg-accent">
                <CardTitle className="text-left">
                  {teamNames[team.type || "other"]}
                </CardTitle>
                <span>(No assigned lead)</span>
                <LucideChevronDown className="h-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-12 py-6">
                <ManageTeamTasks team={team} specs={teamSpecs} tasks={teamTasks} />
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </section>
  );
}
