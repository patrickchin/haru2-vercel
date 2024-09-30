"use client";

import useSWR from "swr";

import { SiteDetailsProps } from "./page";
import { SiteMember } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideTrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HaruUserAvatar, UserAvatar } from "@/components/user-avatar";


export default function SiteMembers({ site, members: origMembers }: SiteDetailsProps) {

  const {
    data: members,
    mutate: mutateMembers,
    isLoading,
    isValidating,
  } = useSWR<SiteMember[] | undefined>(
    `/api/sites/${site.id}/members`, // api route doesn't really exist
    async () => Actions.getSiteMembers(site.id),
    { fallbackData: origMembers },
  );

  return (
    <Card>
      <CardHeader className="font-semibold">
        Project Members
      </CardHeader>
      <CardContent className="space-y-8">
        <ul>
          {members?.map((m) => {
            return (
              <li
                key={m.id}
                className="flex p-4 border rounded bg-muted justify-between"
              >
                <div className="flex items-center gap-3">
                  <HaruUserAvatar user={m} className="w-8 h-8" />
                  <p>{m.name} </p>
                  <p className="capitalize font-semibold">{m.role}</p>
                </div>
                <Button variant="outline" className="flex gap-2">
                  Remove Member
                  <LucideTrash className="w-3.5 h-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
