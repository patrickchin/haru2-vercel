import { DesignTeam, teamNames } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { ManageTeamMembersClient } from "./manage-team-members-client";
import * as Actions from "@/lib/actions";

function ManageTeamMembersSkeleton({ team }: { team: DesignTeam }) {
  return (
    <Card key={team.id} className="p-4">
      <CardHeader>
        <CardTitle>{teamNames[team.type || "other"]}</CardTitle>
      </CardHeader>
      <CardContent>Loading ...</CardContent>
    </Card>
  );
}

async function ManageTeamMembersFetch({ team }: { team: DesignTeam }) {
  const members = await Actions.getTeamMembersDetailed(team.id);
  return <ManageTeamMembersClient team={team} members={members || []} />;
}

export async function ManageTeamMembers({ team }: { team: DesignTeam }) {
  return (
    <Suspense fallback={<ManageTeamMembersSkeleton team={team} />}>
      <ManageTeamMembersFetch team={team} />
    </Suspense>
  );
}
