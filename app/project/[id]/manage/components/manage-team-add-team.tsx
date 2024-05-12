"use client";

import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import * as Actions from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teamNames } from "@/lib/types";
import { useState } from "react";

export default function AddTeamMemberButton({
  projectId,
}: {
  projectId: number;
}) {
  const [selectedTeamType, setSelectedTeamType] = useState("");
  const router = useRouter();
  return (
    <div className="flex gap-2 font-semibold">
      <Select onValueChange={setSelectedTeamType}>
        <SelectTrigger>
          <SelectValue placeholder="Select a team type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(teamNames).map(([k, v]) => (
            <SelectItem key={k} value={k}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={async () => {
          if (selectedTeamType.length > 0) {
            await Actions.createProjectTeam(projectId, selectedTeamType);
          }
          // revalidatePath(pathname); // doesn't work
          router.refresh();
        }}
      >
        <LucidePlus className="h-4" />
        Add Team
      </Button>
    </div>
  );
}
