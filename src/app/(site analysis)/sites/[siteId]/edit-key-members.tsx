"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SiteDetails, SiteDetailsNew, SiteMember } from "@/lib/types";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import { LucideEdit } from "lucide-react";
import {
  Dialog,
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
import { SaveRevertForm } from "@/components/save-revert-form";
import { createInsertSchema } from "drizzle-zod";
import { z, ZodType } from "zod";
import { useCallback } from "react";
import { InfoBox } from "@/components/info-box";

function SiteMemberFields({ form, prefix }: { form: any; prefix: string }) {
  return (
    <div className="flex flex-col">
      <h3 className="capitalize text-base font-semibold">
        {/* hacky */}
        {prefix === "manager" ? "Project Manager" : prefix}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField
          control={form.control}
          name={`${prefix}Name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
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
                  value={field.value || ""}
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
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function EditSiteMembersForm({ site }: { site: SiteDetails }) {
  const schema = createInsertSchema(Schemas.siteDetails1).pick({
    ownerName: true,
    ownerPhone: true,
    ownerEmail: true,
    managerName: true,
    managerPhone: true,
    managerEmail: true,
    contractorName: true,
    contractorPhone: true,
    contractorEmail: true,
    supervisorName: true,
    supervisorPhone: true,
    supervisorEmail: true,
  }) satisfies ZodType<SiteDetailsNew>;
  type SchemaType = z.infer<typeof schema>;

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { ...site },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (d) => {
          const newDetails = await Actions.updateSiteDetails(site.id, d);
          form.reset(newDetails);
        })}
        className="flex flex-col gap-4"
      >
        <SiteMemberFields form={form} prefix="owner" />
        <SiteMemberFields form={form} prefix="manager" />
        <SiteMemberFields form={form} prefix="contractor" />
        <SiteMemberFields form={form} prefix="supervisor" />

        <div className="flex gap-3 justify-end pt-4">
          <SaveRevertForm form={form} />
        </div>
      </form>
    </Form>
  );
}

export function EditKeySiteMembers({
  site,
  dialogName,
}: {
  site: SiteDetails;
  dialogName: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set(name, value) : params.delete(name);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <Dialog
      defaultOpen={searchParams.get("dialog") === dialogName}
      onOpenChange={(o) =>
        router.replace(
          `${pathname}?${createQueryString("dialog", o ? dialogName : null)}`,
          { scroll: false },
        )
      }
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LucideEdit />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-svh overflow-y-auto gap-6">
        <DialogHeader className="py-2">
          <DialogTitle>Edit Key Site Member Information</DialogTitle>
        </DialogHeader>
        <InfoBox>
          Here you can optionally fill out the information of existing members
          of your project and can be updated at any time.
          <br />
          <br />
          {
            'If you would like these members or anyone else to also be able to view the supervisors reports, please add their account in the "Member Permissions" section.'
          }
        </InfoBox>
        <EditSiteMembersForm site={site} />
      </DialogContent>
    </Dialog>
  );
}
