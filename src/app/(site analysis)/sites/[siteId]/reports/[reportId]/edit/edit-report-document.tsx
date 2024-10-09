"use client";

import {
  SiteDetails,
  SiteReport,
  SiteReportAll,
  SiteReportDetails,
  SiteReportSection,
} from "@/lib/types/site";
import useSWR, { KeyedMutator } from "swr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/drizzle/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notFound } from "next/navigation";

const reportFormSchema = createInsertSchema(Schemas.siteReportDetails1);
type ReportFormType = z.infer<typeof reportFormSchema>;
function EditReportEstimates({
  report,
  mutate,
}: {
  report: SiteReportAll;
  mutate: KeyedMutator<SiteReportAll | undefined>;
}) {
  const form = useForm<ReportFormType>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: { ...report },
  });

  return (
    <Card className="bg-yellow-50 border-2">
      <CardHeader className="flex flex-row justify-between">
        <div className="text-lg font-bold">
          Current Budget and Timeline Estimates
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4 pt-0">
        <Form {...form}>
          <form
            className="w-full"
            onSubmit={form.handleSubmit(async (data: ReportFormType) => {
              await Actions.updateSiteReportDetails(report.id, data);
              mutate(); // TODO update from return value above
            })}
          >
            <div className="grid grid-cols-2 gap-6 w-full">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Budget</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        className="w-full"
                        placeholder="eg. $2,000,000.00"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Timeline</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        className=""
                        placeholder="eg. 215 days"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Spent</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        className=""
                        placeholder="eg. $200,000.00"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.toISOString() ?? undefined}
                        // type="date" // TODO see site-meetings
                        placeholder="eg. 02/02/2029"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full mt-6">Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function EditReportDetails({
  report,
  mutate,
}: {
  report: SiteReportAll;
  mutate: KeyedMutator<SiteReportAll | undefined>;
}) {
  const form = useForm<ReportFormType>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: { ...report },
  });

  return (
    <Card className="bg-cyan-50 border-2">
      <CardHeader className="flex flex-row justify-between">
        <div className="text-lg font-bold">Current Construction Activites</div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4 pt-0">
        <Form {...form}>
          <form
            className="w-full"
            onSubmit={form.handleSubmit(async (data: ReportFormType) => {
              await Actions.updateSiteReportDetails(report.id, data);
              mutate(); // TODO update from return value above
            })}
          >
            <div className="basis-1/4 border p-4 bg-background space-y-2">
              <h6>Site Activity</h6>
              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? undefined}
                        className="w-full"
                        placeholder="eg. Excavation"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="basis-1/4 border p-4 bg-background space-y-2 mt-4">
              <h6>Site Personel</h6>

              <div>
                <FormField
                  control={form.control}
                  name="contractors"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Contractors</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          className=""
                          placeholder="eg. John Doe"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="engineers"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Engineers</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          className=""
                          placeholder="eg. John Doe"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workers"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Workers</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          className=""
                          placeholder="eg. John Doe"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visitors"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Visitors</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? undefined}
                          className=""
                          placeholder="eg. John Doe"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="basis-1/4 border p-4 bg-background space-y-2  mt-4">
              <h6>Materials Used</h6>
              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? undefined}
                        className=""
                        placeholder="Type here"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="basis-1/4 border p-4 bg-background space-y-2  mt-4">
              <h6>Equiptment Used</h6>
              <FormField
                control={form.control}
                name="equiptment"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? undefined}
                        className=""
                        placeholder="Type here"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full mt-6">Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function EditReportDocument({
  siteId,
  reportId,
  sections,
}: {
  siteId?: number;
  reportId: number;
  sections?: string[];
}) {

  const { data: report, mutate, isLoading } = useSWR(
    `/api/reports/${reportId}/details`, // api route doesn't really exist
    async () => Actions.getSiteReportDetails(reportId),
  );

  if (isLoading) return <p>loading...</p>;
  if (!report) notFound();

  return (
    <div className={"flex flex-col gap-4"}>
      <EditReportEstimates report={report} mutate={mutate} />
      <EditReportDetails report={report} mutate={mutate} />
    </div>
  );
}
