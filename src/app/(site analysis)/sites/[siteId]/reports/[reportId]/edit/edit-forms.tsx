"use client";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { createInsertSchema } from "drizzle-zod";
import { getTableConfig } from "drizzle-orm/pg-core";
import { SiteReportDetails, SiteReportDetailsNew } from "@/lib/types";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import { LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function UpdateSiteReportForm({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const { data: details, mutate } = useSWR<SiteReportDetails | undefined>(
    `/api/reports/${reportId}/details`, // api route doesn't really exist
    async () => {
      const details = await Actions.getSiteReportDetails(reportId);
      return details;
    },
  );

  const omitColumns = { id: true, createdAt: true, fileGroupId: true };

  const reportFormSchema = createInsertSchema(Schemas.siteReports1).omit(
    omitColumns as any,
  );
  type ReportFormType = z.infer<typeof reportFormSchema>;

  const form = useForm<ReportFormType>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: { ...details },
  });

  let { columns: reportColumns } = getTableConfig(Schemas.siteReports1);
  reportColumns = reportColumns.filter(
    (c) => !Object.keys(omitColumns).includes(c.name),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: any) => {
          console.log(data);
          Actions.updateSiteReport(reportId, data);
        })}
        className="grid grid-cols-3 gap-4"
      >
        {reportColumns.map((c) => (
          <FormField
            key={c.name}
            control={form.control}
            name={c.name as never /* hacks, what is even happening here */}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.name}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="flex gap-2"
            disabled={form.formState.isSubmitting}
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

export function UpdateSiteReportDetailsForm({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const { data: details, mutate } = useSWR<SiteReportDetails | undefined>(
    `/api/reports/${reportId}/details`, // api route doesn't really exist
    async () => {
      const details = await Actions.getSiteReportDetails(reportId);
      return details;
    },
  );

  // const omitColumns = { id: true, createdAt: true, fileGroupId: true };
  const omitColumns = { id: true };

  const detailFormSchema = createInsertSchema(Schemas.siteReportDetails1).omit(
    omitColumns as any,
  );

  type DetailFormType = z.infer<typeof detailFormSchema>;

  const form = useForm<DetailFormType>({
    resolver: zodResolver(detailFormSchema),
    defaultValues: { ...details },
  });

  let { columns: reportColumns } = getTableConfig(Schemas.siteReportDetails1);
  reportColumns = reportColumns.filter(
    (c) => !Object.keys(omitColumns).includes(c.name),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          Actions.updateSiteReportDetails(
            reportId,
            data as SiteReportDetailsNew,
          );
        })}
        className="grid grid-cols-3 gap-4"
      >
        {reportColumns.map((c) => (
          <FormField
            key={c.name}
            control={form.control}
            name={c.name as never}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.name}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    defaultValue={
                      details &&
                      (details[c.name as keyof typeof details] as string)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="flex gap-2"
            disabled={form.formState.isSubmitting}
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
