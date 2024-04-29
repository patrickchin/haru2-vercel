"use client";

import * as React from "react";
import TaskTable from "./task-table";
import { LucideChevronDown } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { DesignTask, teamNames } from "@/lib/types";
import { DesignProject } from "@/lib/types";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

function TeamProgress({
  project,
  team,
  tasks,
}: {
  project: DesignProject;
  team: string;
  tasks: DesignTask[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const isOpen = params.get(team) == "1";

  const updateQueryCurrentTeam = React.useCallback(
    (open: boolean) => {
      const newParams = new URLSearchParams(params.toString());
      newParams.set(team, open ? "1" : "0");
      return newParams.toString();
    },
    [params, team],
  );

  tasks = tasks.filter((task) => task.type == team);

  const completed = tasks.reduce(
    // how tf is this the best say to count instances?
    (n, t) => (t.status === "completed" ? n + 1 : n),
    0,
  );
  const total = tasks.length;
  const pct = total ? (100 * completed) / total : 0;
  // const col = pct < 30 ? "bg-teal-300" :
  //   pct < 80 ? "bg-emerald-300" : "bg-green-300";
  const col = "bg-blue-400";

  return (
    <Card>
      <Collapsible
        className="grow"
        defaultOpen={isOpen}
        onOpenChange={(open: boolean) => {
          const newParams = updateQueryCurrentTeam(open);
          router.replace(`${pathname}?${newParams}`, { scroll: false });
        }}
      >
        <CollapsibleTrigger className="flex gap-4 w-full p-8 text-sm hover:bg-accent">
          <CardTitle className="text-left">{teamNames[team]}</CardTitle>
          <span>(No assigned lead)</span>
          <span className="grow text-right">
            Completed {completed} of {total} total tasks ({pct.toFixed(0)} %)
          </span>
          <LucideChevronDown className="h-5" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-12 py-6">
          <TaskTable
            projectid={project.id}
            data={tasks}
            showTypeColumn={false}
            showFilterToggles={false}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function ProjectTeamsProgressSkeleton() {
  return <div className="flex flex-col space-y-4">Loading ...</div>;
}

export default function ProjectTeamsProgress({
  project,
  tasks,
}: {
  project: DesignProject;
  tasks: DesignTask[];
}) {
  const teams = ["legal", "architectural", "structural", "mep", "other"];
  return (
    <div className="flex flex-col gap-4">
      {teams.map((team, i) => (
        <TeamProgress key={team} project={project} team={team} tasks={tasks} />
      ))}
    </div>
  );
}
