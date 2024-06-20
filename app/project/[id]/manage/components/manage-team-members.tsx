"use client";

import React, { Suspense } from "react";
import { DesignTeam, defaultTeams, teamNames } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesignUserAvatar } from "@/components/user-avatar";
import useSWR, { KeyedMutator } from "swr";
import { Input } from "@/components/ui/input";
import { LucideCheck, LucidePlus, LucideX } from "lucide-react";
import { cn } from "@/lib/utils";


/*
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

function AddTeamButton({ onClick }: { onClick: (s: string) => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2">
          Add Team
          <LucidePlus className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choose a Team to Add</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {defaultTeams.map((type) => (
            <AlertDialogAction onClick={() => onClick(type)} key={type}>
              {teamNames[type]}
            </AlertDialogAction>
          ))}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
*/

function AddAddedButton({
  alreadyAdded,
  onClick,
}: {
  alreadyAdded: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="flex gap-2"
      disabled={alreadyAdded}
      onClick={onClick}
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
    </Button>
  );
}

function ManageSingleTeamMembers({
  team,
  teamsMutate,
}: {
  team: DesignTeam;
  teamsMutate: KeyedMutator<any>;
}) {
  // TODO search on server
  const {
    data: users,
    error: usersError,
    mutate: usersMutate,
  } = useSWR(`/api/users`, () => {
    return Actions.getAllUsers();
  });

  const {
    data: members,
    error: membersError,
    mutate: membersMutate,
  } = useSWR(`/api/team/${team.id}/members`, () => {
    return Actions.getTeamMembersDetailed(team.id);
  });

  const [searchValue, setSearchValue] = React.useState("");
  const filteredUsers = React.useMemo(() => {
    return users?.filter(
      (u) => u.email?.includes(searchValue) || u.name?.includes(searchValue),
    );
  }, [users, searchValue]);

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
      <CardContent className="flex gap-4 px-0 h-[36rem]">
        <div className="w-2/5 h-full flex flex-col gap-3">
          <h4>Add Members:</h4>
          <Input
            type="search"
            placeholder="Search for user or enter an email ..."
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <ScrollArea className="grow border rounded">
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
                onClick={async () => {
                  // membersMutate(await Actions.addTeamMember(team.id, user.id));
                }}
              />
            </div>

            {Array.from(filteredUsers ?? []).map((user, i) => {
              const alreadyAdded = !!members?.find((val) => val.id == user.id);
              return (
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
                  <AddAddedButton
                    alreadyAdded={alreadyAdded}
                    onClick={async () => {
                      membersMutate(
                        await Actions.addTeamMember(team.id, user.id),
                      );
                    }}
                  />
                </div>
              );
            })}
          </ScrollArea>
        </div>

        <div className="w-3/5 h-full flex flex-col gap-3">
          <div className="flex gap-2 items-baseline justify-between">
            <h4 className="">Team Members</h4>
            <span className="text-sm">{members?.length} members</span>
          </div>
          <ScrollArea className="h-full border rounded">
            {Array.from(members ?? []).map((user, i) => (
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
                <Button variant="outline" disabled>Set as Lead</Button>
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
            ))}
          </ScrollArea>
        </div>
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


export default function ManageAllTeamsMembers({ projectId }: { projectId: number }) {
  
  // TODO search on server
  const {
    data: teams,
    error: teamsError,
    mutate: teamsMutate,
  } = useSWR(`/api/project/${projectId}/teams`, () => {
    return Actions.getProjectTeams(projectId);
  });

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