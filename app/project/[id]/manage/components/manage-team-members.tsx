"use client";

import React, { Suspense } from "react";
import { DesignTeam, DesignUserDetailed, teamNames } from "@/lib/types";
import * as Actions from "@/lib/actions";
import { cn } from "@/lib/utils";
import useSWR, { KeyedMutator } from "swr";

import { LucideCheck, LucidePlus, LucideX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesignUserAvatar } from "@/components/user-avatar";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AddAddedButton({
  alreadyAdded,
  addMember,
  removeMember,
}: {
  alreadyAdded: boolean;
  addMember: () => void;
  removeMember: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex gap-2"
        disabled={alreadyAdded}
        onClick={addMember}
      >
        {alreadyAdded ? (
          <>
            Added
            <LucideCheck className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            Add
            <LucidePlus className="w-3.5 h-3.5" />
          </>
        )}
      </Button>{" "}
      <Button
        variant="outline"
        className={cn("flex gap-2", alreadyAdded ? "" : "hidden")}
        disabled={!alreadyAdded}
        onClick={removeMember}
      >
        Remove
        <LucideX className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function AddTeamMemberRowUnregistered({
  searchValue,
}: {
  searchValue: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 items-center hover:bg-accent border-b",
        // searchValue.length > 0 ? "" : "hidden",
      )}
    >
      <div className="grow">
        <div className="font-medium">Unregistered</div>
        <div className="text-sm text-muted-foreground md:inline">
          {searchValue.length > 0 ? searchValue : "Search to Send Email Invite"}
        </div>
      </div>
      <AddAddedButton
        alreadyAdded={false} // TODO
        addMember={async () => {
          // membersMutate(await Actions.addTeamMember(team.id, user.id));
        }}
        removeMember={() => {}}
      />
    </div>
  );
}

function AddTeamMemberRow({
  user,
  team,
  members,
  membersMutate,
}: {
  user: DesignUserDetailed;
  team: DesignTeam;
  members: DesignUserDetailed[];
  membersMutate: KeyedMutator<DesignUserDetailed[] | undefined>;
}) {
  const alreadyAdded = !!members?.find((val) => val.id == user.id);
  return (
    <div className="flex gap-4 p-4 items-center hover:bg-accent border-b">
      <DesignUserAvatar user={user} />
      <div className="grow">
        <div className="font-medium">{user.name || "Unregistered Account"}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {user.email}
        </div>
      </div>
      <AddAddedButton
        alreadyAdded={alreadyAdded}
        addMember={async () =>
          membersMutate(await Actions.addTeamMember(team.id, user.id))
        }
        removeMember={() =>
          membersMutate(Actions.removeTeamMember(team.id, user.id))
        }
      />
    </div>
  );
}

function AddTeamMemberDialogContent({
  team,
  members,
  membersMutate,
}: {
  team: DesignTeam;
  members: DesignUserDetailed[];
  membersMutate: KeyedMutator<DesignUserDetailed[] | undefined>;
}) {
  // TODO search on server if too many users
  const {
    data: users,
    error: usersError,
    mutate: usersMutate,
  } = useSWR(`/api/users`, () => {
    return Actions.getAllUsers();
  });

  const [searchValue, setSearchValue] = React.useState("");
  const filteredUsers = React.useMemo(() => {
    return users?.filter(
      (u) => u.email?.includes(searchValue) || u.name?.includes(searchValue),
    );
  }, [users, searchValue]);

  return (
    <AlertDialogContent className="flex flex-col gap-4 max-w-3xl p-12 h-[90vh] max-h-svh">
      <AlertDialogTitle className="text-2xl">Add Members:</AlertDialogTitle>
      <Input
        type="search"
        placeholder="Search for user or enter an email ..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {/* https://stackoverflow.com/questions/14962468/how-can-i-combine-flexbox-and-vertical-scroll-in-a-full-height-app */}
      <ScrollArea className="grow border rounded h-0">
        <AddTeamMemberRowUnregistered searchValue={searchValue} />
        {Array.from(filteredUsers ?? []).map((user, i) => (
          <AddTeamMemberRow
            key={i}
            user={user}
            team={team}
            members={members}
            membersMutate={membersMutate}
          />
        ))}
      </ScrollArea>
      <AlertDialogAction>Done</AlertDialogAction>
    </AlertDialogContent>
  );
}

function AddTeamMemberButton({
  team,
  members,
  membersMutate,
}: {
  team: DesignTeam;
  members: DesignUserDetailed[];
  membersMutate: KeyedMutator<DesignUserDetailed[] | undefined>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2">
          Add Members
          <LucidePlus className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AddTeamMemberDialogContent
        team={team}
        members={members ?? []}
        membersMutate={membersMutate}
      />
    </AlertDialog>
  );
}

/*
function AddTeamButton({ onClick }: { onClick: (s: string) => void }) {
}
*/

function ManageSingleTeamMembers({
  team,
  teamsMutate,
}: {
  team: DesignTeam;
  teamsMutate: KeyedMutator<DesignTeam[] | undefined>;
}) {
  const {
    data: members,
    error: membersError,
    mutate: membersMutate,
  } = useSWR(`/api/team/${team.id}/members`, () => {
    return Actions.getTeamMembersDetailed(team.id);
  });

  return (
    <Card className="flex flex-col px-8 py-6 gap-4">
      <div className="flex py-2 justify-between items-center">
        <h3>{teamNames[team.type || "other"]}</h3>
        <Button
          className="hidden"
          disabled={true}
          variant="secondary"
          onClick={() => {
            Actions.deleteProjectTeam(team.id);
            teamsMutate();
          }}
        >
          Delete Team
        </Button>
      </div>
      <CardContent className="flex flex-col gap-3 px-0 min-h-48 max-h-[36rem]">
        <div className="flex gap-2 items-baseline justify-between">
          <h4 className="">Team Members</h4>
          <div className="flex gap-3 items-center">
            <span className="text-sm">{members?.length} members</span>
            <AddTeamMemberButton
              team={team}
              members={members ?? []}
              membersMutate={membersMutate}
            />
          </div>
        </div>
        <ScrollArea className="h-full border rounded">
          {Array.from(members ?? []).map((user, i) => {
            const isLead = team.lead?.id === user.id;
            return (
              <div
                key={i}
                className="flex gap-6 px-6 py-4 items-center hover:bg-accent border-b"
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
                <Button
                  variant="outline"
                  disabled={isLead}
                  onClick={() => {
                    Actions.setTeamLead(team.id, user.id);
                    teamsMutate();
                  }}
                >
                  {isLead ? "Current Team Lead" : "Set as Lead"}
                </Button>
                {/* <Button variant="outline" disabled>Send Invite</Button> */}
                <Button
                  variant="outline"
                  className="flex gap-1"
                  onClick={() =>
                    membersMutate(Actions.removeTeamMember(team.id, user.id))
                  }
                >
                  Remove <LucideX className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

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

export default function ManageAllTeamsMembers({
  projectId,
}: {
  projectId: number;
}) {
  // TODO search on server
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
      <div className="flex justify-between px-6">
        <h3>Team Member Selection</h3>
        {/* <ComboboxDemo /> */}
        {/* <AddTeamButton
          onClick={(type: string) => teamsMutate(Actions.createProjectTeam(projectId, type))}
        /> */}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {teams?.map((team) => (
          <Suspense
            key={team.id}
            fallback={<ManageTeamMembersSkeleton team={team} />}
          >
            <ManageSingleTeamMembers team={team} teamsMutate={teamsMutate} />
          </Suspense>
        ))}
      </div>
    </section>
  );
}
