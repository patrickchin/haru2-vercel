"use client";

import useSWR, { KeyedMutator } from "swr";
import { SiteDetailsProps } from "./page";
import { SiteMember } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideLoader2, LucidePlus, LucideTrash } from "lucide-react";
import { HaruUserAvatar } from "@/components/user-avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

export default function SiteMembers({
  site,
  members: origMembers,
}: SiteDetailsProps) {
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
      <CardHeader className="font-semibold">Project Members</CardHeader>
      <CardContent className="space-y-8">
        <SiteSearchAddMember siteId={site.id} mutate={mutateMembers} />
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
                <Button
                  disabled={m.role === "owner"}
                  variant="outline"
                  className="flex gap-2"
                  onClick={async () => {
                    await Actions.removeSiteMember({
                      siteId: site.id,
                      userId: m.id,
                    });
                    mutateMembers();
                  }}
                >
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
