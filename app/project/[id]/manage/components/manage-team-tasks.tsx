import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { DesignTaskSpec, teamNames } from "@/lib/types";
import { LucideChevronDown } from "lucide-react";

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
            <Checkbox id={`taskspec-${team}-${i}`} checked={true} />
            {/* <Button variant="outline" className="p-1">
                    <LucidePlus className="h-5" />
                  </Button> */}
          </div>
        </Label>
      ))}
    </div>
  );
}

export default function ManageTeamTasksDropdown({
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
