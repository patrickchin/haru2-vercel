"use client";

import useSWR, { KeyedMutator } from "swr";
import {
  allSiteMemberRoles,
  SiteDetails,
  SiteMember,
  SiteMemberRole,
} from "@/lib/types";
import * as Actions from "@/lib/actions";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { LucideLoader2, LucidePlus, LucideTrash } from "lucide-react";
import { HaruUserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { editSiteRoles } from "@/lib/permissions";

function SiteSearchAddMember({
  siteId,
  mutate,
}: {
  siteId: number;
  mutate: KeyedMutator<SiteMember[] | undefined>;
}) {
  const memberFormSchema = z.object({
    email: z.string().email(),
  });
  type MemberFormType = z.infer<typeof memberFormSchema>;

  const form = useForm<MemberFormType>({
    resolver: zodResolver(memberFormSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: MemberFormType) => {
          await Actions.addSiteMemberByEmail({ siteId, email: data.email });
          mutate();
        })}
        className="flex gap-4 items-end"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grow max-w-lg">
              <FormLabel>Add User</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email address of the user to add"
                  />

                  <Button
                    type="submit"
                    className="flex gap-2"
                    disabled={form.formState.isSubmitting}
                  >
                    Add User
                    {form.formState.isSubmitting ? (
                      <LucideLoader2 className={cn("animate-spin w-4 h-4")} />
                    ) : (
                      <LucidePlus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex"></div>
      </form>
    </Form>
  );
}

function SiteMemberSelectRole({
  siteId,
  member,
  mutate,
  disabled,
}: {
  siteId: number;
  member: SiteMember;
  mutate: KeyedMutator<SiteMember[] | undefined>;
  disabled: boolean;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <Select
      disabled={member.role === "owner" || isUpdating || disabled}
      onValueChange={async (r) => {
        try {
          setIsUpdating(true);
          const ret = await Actions.updateSiteMemberRole({
            siteId,
            userId: member.id,
            role: r as SiteMemberRole,
          });
          if (ret) await mutate();
        } finally {
          setIsUpdating(false);
        }
      }}
    >
      <SelectTrigger className="w-48 capitalize">
        <SelectValue placeholder={member.role} />
        {isUpdating && <LucideLoader2 className="animate-spin h-4" />}
      </SelectTrigger>
      <SelectContent>
        {allSiteMemberRoles.map((r) => {
          return (
            r !== "owner" && (
              <SelectItem
                key={r}
                value={r}
                className="capitalize"
                disabled={r === member.role}
              >
                {r}
              </SelectItem>
            )
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default function SiteMembers({
  site,
  members: origMembers,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}) {
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
  const [isRemoving, setIsRemoving] = useState(false);
  const { data: session } = useSession();
  const role = members?.find((m) => m.id === session?.user?.idn)?.role;
  const canEditSite = role && editSiteRoles.includes(role);

  return (
    <Card>
      <CardHeader className="font-semibold">Project Members</CardHeader>
      <CardContent className="space-y-8">
        {canEditSite && (
          <SiteSearchAddMember siteId={site.id} mutate={mutateMembers} />
        )}
        <ul className="border rounded overflow-hidden">
          {members?.map((m) => {
            return (
              <li
                key={m.id}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-background justify-between [&:not(:last-child)]:border-b"
              >
                <div className="flex gap-3 items-center">
                  <HaruUserAvatar user={m} className="w-8 h-8" />
                  <p>{m.name}</p>
                </div>
                {canEditSite ? (
                  <div className="flex flex-row gap-3 sm:items-center">
                    <SiteMemberSelectRole
                      siteId={site.id}
                      member={m}
                      mutate={mutateMembers}
                      disabled={isRemoving}
                    />
                    <Button
                      disabled={m.role === "owner" || isRemoving}
                      variant="outline"
                      className="flex gap-2"
                      onClick={async () => {
                        try {
                          setIsRemoving(true);
                          await Actions.removeSiteMember({
                            siteId: site.id,
                            userId: m.id,
                          });
                          await mutateMembers();
                        } finally {
                          setIsRemoving(false);
                        }
                      }}
                    >
                      Remove Member
                      {isRemoving ? (
                        <LucideLoader2 className={cn("animate-spin w-4 h-4")} />
                      ) : (
                        <LucideTrash className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <p className="capitalize">{m.role}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
