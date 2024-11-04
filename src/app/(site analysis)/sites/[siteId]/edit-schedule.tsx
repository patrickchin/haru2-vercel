"use client";

import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { SiteDetails, SiteDetailsNew } from "@/lib/types";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { InputDate } from "@/components/input-date";
import { Input } from "@/components/ui/input";
import { SaveRevertForm } from "@/components/save-revert-form";

function EditSiteScheduleForm({ site }: { site: SiteDetails }) {
  const editScheduleSchema = createInsertSchema(Schemas.siteDetails1).pick({
    startDate: true,
    endDate: true,
    nextReportDate: true,
    schedule: true,
  }) satisfies ZodType<SiteDetailsNew>;

  type EditScheduleSchema = z.infer<typeof editScheduleSchema>;

  const form = useForm<EditScheduleSchema>({
    resolver: zodResolver(editScheduleSchema),
    defaultValues: { ...site },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: EditScheduleSchema) => {
          const newDetails = await Actions.updateSiteDetails(site.id, data);
          form.reset(newDetails);
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="grow max-w-lg">
              <FormLabel>Start Date</FormLabel>
              <InputDate field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="grow max-w-lg">
              <FormLabel>End Date</FormLabel>
              <InputDate field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nextReportDate"
          render={({ field }) => (
            <FormItem className="grow max-w-lg">
              <FormLabel>End Date</FormLabel>
              <InputDate field={field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem className="grow max-w-lg">
              <FormLabel>Schedule</FormLabel>
              <Input placeholder="Tuesdays and Thursdays, weekly" {...field} value={field.value || undefined} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <SaveRevertForm form={form} />
        </div>
      </form>
    </Form>
  );
}

export function EditSiteSchedule({ site }: { site: SiteDetails }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Supervision Milestones</DialogTitle>
        <EditSiteScheduleForm site={site} />
      </DialogContent>
    </Dialog>
  );
}
