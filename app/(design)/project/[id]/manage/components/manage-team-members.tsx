"use client";

import React, { Suspense } from "react";
import {
  DesignTeam,
  DesignUserBasic,
  DesignUserDetailed,
  teamNames,
} from "@/lib/types";
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
  AlertDialogContent,
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
    <li
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
          // add an unregistered user
          // membersMutate(await Actions.addTeamMember(team.id, user.id));
        }}
        removeMember={() => {}}
      />
    </li>
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
    <li className="flex gap-4 p-4 items-center hover:bg-accent border-b">
      <DesignUserAvatar user={user as DesignUserBasic} />
      <div className="grow">
        <div className="font-medium">{user.name || "Unregistered Account"}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {user.email}
        </div>
      </div>
      <AddAddedButton
        alreadyAdded={alreadyAdded}
        addMember={() =>
          membersMutate(Actions.addTeamMember(team.id, user.id), {
            revalidate: false,
          })
        }
        removeMember={() =>
          membersMutate(Actions.removeTeamMember(team.id, user.id), {
            revalidate: false,
          })
        }
      />
    </li>
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
        maxLength={50}
        type="search"
        placeholder="Search for user or enter an email ..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {/* https://stackoverflow.com/questions/14962468/how-can-i-combine-flexbox-and-vertical-scroll-in-a-full-height-app */}
      <ScrollArea className="grow border rounded h-0">
        <ol className="pb-4">
          <AddTeamMemberRowUnregistered searchValue={searchValue} />
          {filteredUsers && filteredUsers.length > 0 ? (
            Array.from(filteredUsers).map((user, i) => (
              <AddTeamMemberRow
                key={i}
                user={user}
                team={team}
                members={members}
                membersMutate={membersMutate}
              />
            ))
          ) : (
            <li className="p-8 pb-0 flex justify-center items-center align-bottom">
              No users found with this name or email: {searchValue}
            </li>
          )}
        </ol>
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

function ManageTeamMemberRow({
  user,
  team,
  teamsMutate,
  members,
  membersMutate,
}: {
  user: DesignUserDetailed;
  team: DesignTeam;
  teamsMutate: KeyedMutator<DesignTeam[] | undefined>;
  members: DesignUserDetailed[];
  membersMutate: KeyedMutator<DesignUserDetailed[] | undefined>;
}) {
  const isLead = team.lead?.id === user.id;
  return (
    <li className="flex gap-6 px-6 py-4 items-center hover:bg-accent border-b">
      <DesignUserAvatar user={user} />
      <div className="grow">
        <div className="font-medium">{user.name || "Unregistered Account"}</div>
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
          membersMutate(Actions.removeTeamMember(team.id, user.id), {
            revalidate: false,
          })
        }
      >
        Remove <LucideX className="w-3.5 h-3.5" />
      </Button>
    </li>
  );
}

function ManageTeamMembers({
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
        <CardTitle>{teamNames[team.type || "other"]}</CardTitle>
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
      <CardContent className="flex flex-col gap-3 px-0">
        <div className="flex gap-2 items-baseline justify-between">
          <h6 className="">Team Members</h6>
          <div className="flex gap-3 items-center">
            <span className="text-sm">{members?.length} members</span>
            <AddTeamMemberButton
              team={team}
              members={members ?? []}
              membersMutate={membersMutate}
            />
          </div>
        </div>
        <ScrollArea className="min-h-48 max-h-[28rem] border rounded">
          <ol className="pb-4 h-full">
            {members && members.length > 0 ? (
              Array.from(members).map((user, i) => (
                <ManageTeamMemberRow
                  key={i}
                  user={user}
                  team={team}
                  teamsMutate={teamsMutate}
                  members={members}
                  membersMutate={membersMutate}
                />
              ))
            ) : (
              <li className="flex h-48 items-center justify-center">
                This team has no members
              </li>
            )}
          </ol>
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
        <h4>Team Member Selection</h4>
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
            <ManageTeamMembers team={team} teamsMutate={teamsMutate} />
          </Suspense>
        ))}
      </div>
    </section>
  );
}
