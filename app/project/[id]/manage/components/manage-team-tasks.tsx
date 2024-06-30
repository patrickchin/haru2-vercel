"use client";

import { useState } from "react";
import {
  LucideCheck,
  LucideChevronDown,
  LucideLoader2,
  LucideMinus,
  LucidePlus,
  LucideX,
} from "lucide-react";
import useSWR, { KeyedMutator } from "swr";

import { DesignTask, DesignTaskSpec, DesignTeam, teamNames } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

function NumberInput() {
  return (
    <div className="flex">
      <Button
        variant="outline"
        size="icon"
        className="rounded-r-none focus:z-10 shrink-0 w-8"
      >
        <LucideMinus className="w-3.5 h-3.5" />
      </Button>
      <Input className="rounded-none border-l-0 border-r-0 focus:z-10" />
      <Button
        variant="outline"
        size="icon"
        className="rounded-l-none focus:z-0 shrink-0 w-8"
      >
        <LucidePlus className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function NumperInputPopup() {
  const [est, setEst] = useState(1);
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">{est}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Card className="flex flex-col">
          Estimated number of days
          <NumberInput />
          <Button>Save</Button>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

function ManageTaskRow({
  projectId,
  spec,
  task,
  tasks,
  tasksMutate,
}: {
  projectId: number;
  spec?: DesignTaskSpec;
  task?: DesignTask;
  tasks: DesignTask[];
  tasksMutate: KeyedMutator<DesignTask[] | undefined>;
}) {
  const [isPending, setIsPending] = useState(false);
  const [taskEnabled, setTaskEnabled] = useState(task?.enabled ?? true);

  if (!task) return null;
  if (!projectId) return null;

  const toggleTaskEnabled = async () => {
    try {
      setIsPending(true);
      setTaskEnabled(!taskEnabled);
      task.enabled = !taskEnabled;
      tasksMutate(Actions.enableProjectTask(task.id, !taskEnabled), {
        revalidate: false,
        optimisticData: tasks,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <li
      className={cn(
        "flex justify-between border-b gap-2 py-4 px-6",
        taskEnabled ? "" : "text-muted-foreground bg-muted",
      )}
    >
      <div className="flex flex-col gap-4">
        <h6>
          {task.title} {taskEnabled ? "" : "(Disabled)"}
        </h6>
        <div className="text-sm">{task.description}</div>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <div className="flex items-center w-36 hidden">
          Days {task.estimation}
          <NumperInputPopup />
          {/* <NumberInput /> */}
        </div>
        <Button
          variant="outline"
          className="flex gap-2 w-28"
          disabled={isPending}
          onClick={toggleTaskEnabled}
        >
          {taskEnabled ? "Disable" : "Enable"}
          {isPending ? (
            <LucideLoader2 className="w-3.5 h-3.5 animate-spin" />
          ) : taskEnabled ? (
            <LucideX className="w-3.5 h-3.5" />
          ) : (
            <LucideCheck className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </li>
  );
}

function ManageTeamTasks({ team }: { team: DesignTeam }) {
  const {
    data: specs,
    error: specsError,
    mutate: specsMutate,
  } = useSWR(`/api/specs/${team.type}`, () => {
    if (team.type) return Actions.getTaskSpecsType(team.type);
  });

  const {
    data: tasks,
    error: tasksError,
    mutate: tasksMutate,
  } = useSWR(`/api/project/${team.projectid}/tasks/${team.type}`, () => {
    if (team.projectid && team.type)
      return Actions.getProjectTasksAllOfType(team.projectid, team.type);
  });

  const projectId = team.projectid;
  if (!team.type) return null;
  if (!team.projectid) return null;
  if (!specs) return null;
  if (!tasks) return null;
  if (!projectId) return null;

  // specs or tasks?? or join them??

  tasks.sort((a, b) => a.id - b.id);

  // const nTasksEnabled = tasks.reduce((s, val) => s + (val.enabled ? 1 : 0), 0);

  return (
    <Card key={team.id}>
      <Collapsible className="grow" defaultOpen={true}>
        <CollapsibleTrigger className="flex gap-4 w-full p-8 text-sm hover:bg-accent justify-between">
          <div className="flex gap-4">
            <CardTitle className="text-left">
              {teamNames[team.type || "other"]}
            </CardTitle>
            <span>
              {team.lead
                ? `Team Lead: ${team.lead?.name}`
                : "(No assigned lead)"}
            </span>
          </div>
          <div className="flex gap-4">
            {/* {nTasksEnabled} of {teamTasks.length} tasks enabled */}
            <LucideChevronDown className="w-5 h-5" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-8 py-6">
          <ScrollArea className="min-h-48 h-[36rem] border rounded">
            <ol className="pb-4 h-full">
              {tasks.map((task, i) => (
                <ManageTaskRow
                  key={i}
                  projectId={projectId}
                  task={task}
                  tasks={tasks}
                  tasksMutate={tasksMutate}
                />
              ))}
            </ol>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </Card>
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

  teams?.sort((a, b) => a.id - b.id);

  return (
    <section className="flex flex-col gap-4">
      <div className="px-6">
        <h4>Team Task Selection</h4>
      </div>

      {teams?.map((team) => {
        return (
          <ManageTeamTasks key={team.id} team={team} />
          
        );
      })}
    </section>
  );
}
