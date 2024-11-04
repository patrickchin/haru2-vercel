"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSiteMembersType, updateSiteMembersSchema } from "@/lib/forms";
import * as Actions from "@/lib/actions";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideEdit, LucideLoader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SiteDetails, SiteMember } from "@/lib/types";

function SiteMemberFields({
  site,
  form,
  prefix,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
} & { form: any; prefix: string }) {
  return (
    <div className="flex flex-col">
      <h3 className="capitalize text-base font-semibold">{prefix}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField
          control={form.control}
          name={`${prefix}Name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}Phone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Include International Code (+234 803 555 5555)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${prefix}Email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function EditSiteMembersForm({
  site,
  members,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const form = useForm<UpdateSiteMembersType>({
    resolver: zodResolver(updateSiteMembersSchema),
    defaultValues: {
      // so ugly
      managerName: site.managerName ?? undefined,
      managerPhone: site.managerPhone ?? undefined,
      managerEmail: site.managerEmail ?? undefined,
      contractorName: site.contractorName ?? undefined,
      contractorPhone: site.contractorPhone ?? undefined,
      contractorEmail: site.contractorEmail ?? undefined,
      supervisorName: site.supervisorName ?? undefined,
      supervisorPhone: site.supervisorPhone ?? undefined,
      supervisorEmail: site.supervisorEmail ?? undefined,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (d) => {
          Actions.updateKeySiteUsers(site.id, d);
          router.replace(`${pathname}?${createQueryString("m", "0")}`);
        })}
        className="flex flex-col gap-4"
      >
        <SiteMemberFields
          site={site}
          members={members}
          form={form}
          prefix="proj. manager"
        />
        <SiteMemberFields
          site={site}
          members={members}
          form={form}
          prefix="contractor"
        />
        <SiteMemberFields
          site={site}
          members={members}
          form={form}
          prefix="supervisor"
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button
            asChild
            variant="secondary"
            type="button"
            className="flex gap-2"
            // disabled={form.formState.isSubmitting}
          >
            <DialogClose>Cancel</DialogClose>
          </Button>
          <Button
            type="submit"
            className="flex gap-2"
            // disabled={form.formState.isSubmitting}
          >
            Save
            <LucideLoader2
              className={cn(
                "animate-spin w-4 h-4",
                form.formState.isSubmitting ? "" : "hidden",
              )}
            />
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function EditSiteMembersButtonPopup({
  site,
  members,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      console.log("setting ", name, value);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  return (
    <Dialog
      open={searchParams.get("m") === "1"}
      onOpenChange={(o) =>
        router.replace(pathname + "?" + createQueryString("m", o ? "1" : "0"))
      }
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          Edit Members <LucideEdit className="ml-2 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-svh overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Key Site Member Information</DialogTitle>
        </DialogHeader>
        <EditSiteMembersForm site={site} members={members} />
      </DialogContent>
    </Dialog>
  );
}
