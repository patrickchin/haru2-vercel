"use client";

import { LucideChevronDown } from "lucide-react";
import useSWR, { KeyedMutator } from "swr";

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
  tasksMutate,
}: {
  projectId: number;
  spec?: DesignTaskSpec;
  task?: DesignTask;
  tasksMutate: KeyedMutator<DesignTask[] | undefined>;
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
            tasksMutate();
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
  tasksMutate,
}: {
  team: DesignTeam;
  specs: DesignTaskSpec[];
  tasks: DesignTask[];
  tasksMutate: KeyedMutator<DesignTask[] | undefined>;
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
          <TaskCheckBox
            key={i}
            projectId={projectId}
            task={task}
            tasksMutate={tasksMutate}
          />
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

  teams?.sort((a, b) => a.id - b.id).reverse();
  Object.values(specs).forEach((s) => s.sort((a, b) => a.id - b.id).reverse());
  tasks?.sort((a, b) => a.id - b.id).reverse();

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
        const nTasksEnabled = teamTasks.reduce(
          (s, val) => s + (val.enabled ? 1 : 0),
          0,
        );
        return (
          <Card key={team.id}>
            <Collapsible className="grow">
              <CollapsibleTrigger className="flex gap-4 w-full p-8 text-sm hover:bg-accent justify-between">
                <div className="flex gap-4">
                  <CardTitle className="text-left">
                    {teamNames[team.type || "other"]}
                  </CardTitle>
                  <span>(No assigned lead) TODO</span>
                </div>
                <div className="flex gap-4">
                  {nTasksEnabled} of {teamTasks.length} tasks enabled
                  <LucideChevronDown className="w-5 h-5" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-12 py-6">
                <ManageTeamTasks
                  team={team}
                  specs={teamSpecs}
                  tasks={teamTasks}
                  tasksMutate={tasksMutate}
                />
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </section>
  );
}
