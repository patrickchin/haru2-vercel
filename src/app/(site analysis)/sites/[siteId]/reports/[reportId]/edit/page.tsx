"use client";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Actions from "@/lib/actions";
import { z } from "zod";

import { LucideLoader2 } from "lucide-react";
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
import { DefaultLayout } from "@/components/page-layouts";

import * as Schemas from "@/drizzle/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Textarea } from "@/components/ui/textarea";
import { getTableConfig } from "drizzle-orm/pg-core";

function UpdateSiteReportForm({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const omitColumns = { id: true, createdAt: true, fileGroupId: true };

  const reportFormSchema = createInsertSchema(Schemas.siteReports1).omit(
    omitColumns as any,
  );
  type ReportFormType = z.infer<typeof reportFormSchema>;

  const form = useForm<ReportFormType>({
    resolver: zodResolver(reportFormSchema),
  });

  let { columns: reportColumns } = getTableConfig(Schemas.siteReports1);
  reportColumns = reportColumns.filter(
    (c) => !Object.keys(omitColumns).includes(c.name),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
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

function UpdateSiteReportDetailsForm({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  // const omitColumns = { id: true, createdAt: true, fileGroupId: true };
  const omitColumns = { id: true };

  const detailFormSchema = createInsertSchema(Schemas.siteReportDetails1).omit(
    omitColumns as any,
  );

  type DetailFormType = z.infer<typeof detailFormSchema>;

  const form = useForm<DetailFormType>({
    resolver: zodResolver(detailFormSchema),
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
          Actions.updateSiteReportDetails(reportId, data);
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

export default function Page({
  params,
}: {
  params: { siteId: string; reportId: string };
}) {
  const siteId = Number(params.siteId);
  const reportId = Number(params.reportId);
  return (
    <DefaultLayout>
      <UpdateSiteReportForm siteId={siteId} reportId={reportId} />
      <UpdateSiteReportDetailsForm siteId={siteId} reportId={reportId} />
    </DefaultLayout>
  );
}
