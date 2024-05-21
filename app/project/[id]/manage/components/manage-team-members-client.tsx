"use client";

import { useRef, useState } from "react";
import { LucidePlus } from "lucide-react";
import { DesignTeam, DesignUserBasic, teamNames } from "@/lib/types";
import * as Actions from "@/lib/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesignUserAvatar } from "@/components/user-avatar";

export function ManageTeamMembersClient({
  team,
  members,
}: {
  team: DesignTeam;
  members: DesignUserBasic[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [updatedMembers, setUpdatedMembers] = useState(new Set(members));

  async function addMemberAction(data: FormData) {
    const newUserEmail = data.get("email") as string;
    formRef.current?.reset();
    const newMembers = await Actions.addTeamMember(team.id, newUserEmail);
    if (newMembers) setUpdatedMembers(new Set(newMembers));
  }

  return (
    <Card className="flex flex-col px-8 py-6">
      <CardHeader className="flex flex-row p-0 py-2 space-y-0">
        <div className="text-xl font-semibold h-10">
          {teamNames[team.type || "other"]}
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <form action={addMemberAction} className="flex gap-3" ref={formRef}>
          <Input name="email" type="email" />
          <Button variant="secondary">
            <LucidePlus className="h-4" />
            Add
          </Button>
        </form>
        <ScrollArea className="h-64 border rounded">
          {Array.from(updatedMembers).map((user, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 items-center hover:bg-accent border-b"
            >
              <DesignUserAvatar user={user} />
              <div className="grow">
                <div className="font-medium">
                  {user.name || "Unregistered Account"}
                </div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {user.email}
                </div>
              </div>
              <Button variant="outline">Set as Lead</Button>
              <Button variant="outline">Send Invite</Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
