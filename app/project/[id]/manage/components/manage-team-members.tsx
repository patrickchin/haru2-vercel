import { DesignTeam, DesignTeamMember, teamNames } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { ManageTeamMembersClient } from "./manage-team-members-client";

function ManageTeamMembersSkeleton({ team, }: { team: string; }) {
  return (
    <Card key={team} className="p-4">
      <CardHeader>
        <CardTitle>{teamNames[team]}</CardTitle>
      </CardHeader>
      <CardContent>Loading ...</CardContent>
    </Card>
  );
}

async function ManageTeamMembersFetch({
  team
}: {
  team: DesignTeam;
}) {
  const members: DesignTeamMember[] = [];
  return <ManageTeamMembersClient team={team} members={members} />;
}

export async function ManageTeamMembers({ team }: { team: DesignTeam }) {
  return (
    <Suspense fallback={<ManageTeamMembersSkeleton team={team.type || "Unknown Team"} />}>
      <ManageTeamMembersFetch team={team} />
    </Suspense>
  );
}
