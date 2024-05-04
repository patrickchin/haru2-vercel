"use client";

import { useRef, useState } from "react";
import { LucidePlus } from "lucide-react";
import { DesignTeam, DesignTeamMember, teamNames } from "@/lib/types";
import * as Actions from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import assert from "assert";

export function ManageTeamMembersClient({
  team,
  members,
}: {
  team: DesignTeam;
  members: DesignTeamMember[];
}) {
  const [teamId, setTeamId] = useState(
    members !== undefined && members.length !== 0
      ? members[0].teams1.id
      : undefined,
  );
  const formRef = useRef();

  async function createTeamClicked() {
    const dbteam = await Actions.createProjectTeam(projectid, team);
    if (dbteam !== undefined && dbteam.length > 0) {
      setTeamId(dbteam[0].teams1.id);
    }
  }

  async function addMemberAction(data: FormData) {
    console.log(" xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log("data: ", data.get("email"));
    assert(teamId !== undefined);
    const newMembers = await Actions.addTeamMember(teamId, data.get("email") as string);
    console.log(newMembers);
    formRef?.current?.reset();
  }

  return (
    <Card key={team} className="flex flex-col px-8 py-6 h-96">
      <CardHeader className="flex flex-row justify-between p-0 py-2 space-y-0">
        <div className="text-xl font-semibold h-10">{teamNames[team.type]}</div>
        {teamId === undefined && (
          <Button variant="secondary" onClick={createTeamClicked}>
            <LucidePlus className="h-4" />
            Create Team
          </Button>
        )}
      </CardHeader>
      {teamId !== undefined ? (
        <CardContent className="p-0">
          <form action={addMemberAction} className="flex gap-3" ref={formRef}>
            <Input name="email" type="email" />
            <Button variant="secondary">
              <LucidePlus className="h-4" />
              Add
            </Button>
          </form>
          <ScrollArea className="h-48">

          </ScrollArea>
        </CardContent>
      ) : (
        <CardContent className="grow grid justify-center items-center">
          Create a team to start adding members
        </CardContent>
      )}
    </Card>
  );
}