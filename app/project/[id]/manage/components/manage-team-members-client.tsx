"use client";

import { useRef, useState, } from "react";
import { LucidePlus } from "lucide-react";
import { DesignTeam, DesignTeamMember, teamNames } from "@/lib/types";
import * as Actions from "@/lib/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ManageTeamMembersClient({
  team,
  members,
}: {
  team: DesignTeam;
  members: DesignTeamMember[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [teamDeleted, setTeamDeleted] = useState(false);

  if (teamDeleted) return null;

  async function addMemberAction(data: FormData) {
    const newUserEmail = data.get("email") as string;
    const newMembers = await Actions.addTeamMember(team.id, newUserEmail);
    formRef?.current?.reset();
  }

  return (
    <Card className="flex flex-col px-8 py-6 h-96">
      <CardHeader className="flex flex-row justify-between p-0 py-2 space-y-0">
        <div className="text-xl font-semibold h-10">{teamNames[team.type || "other"]}</div>
        <Button variant="destructive" onClick={async () => {
          setTeamDeleted(true); // maybe only once returned true
          Actions.deleteProjectTeam(team.id)
        }}>Remove Team</Button>
      </CardHeader>
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
    </Card>
  );
}