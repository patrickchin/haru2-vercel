"use client";

import { notFound } from "next/navigation";
import useSWR, { KeyedMutator } from "swr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { SiteReportAll } from "@/lib/types/site";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SaveRevertForm } from "@/components/save-revert-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        <h2 className="text-lg font-bold">
          Current Budget and Timeline Estimates
        </h2>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(async (data: ReportFormType) => {
              await Actions.updateSiteReportDetails(report.id, data);
              const newReport = await mutate(); // TODO update from return value above
              form.reset(newReport);
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

            <div className="flex gap-2 justify-end">
              <SaveRevertForm form={form} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function EditEquipment({
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

  const placeholder =
    "e.g.\nSand - 10kg bags x 10\nGravel - 10kg bags x 8\nCrushed Stone ...";

  return (
    <Dialog>
      <div className="flex gap-4 items-center p-4 rounded border bg-background">
        <h2 className="text-base font-semibold grow text-left">
          Equipment Status
        </h2>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Open
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        className="max-h-[90svh] h-[50rem] flex flex-col p-4 gap-4"
        id="edit-equipment-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Equipment Status
        </DialogTitle>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 grow"
            onSubmit={form.handleSubmit(async (data: ReportFormType) => {
              const newReport = await mutate(
                Actions.updateSiteReportDetails(report.id, data),
              );
              form.reset(newReport);
            })}
          >
            <FormField
              control={form.control}
              name="equiptment"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? undefined}
                      className="h-full text-base leading-8 resize-none"
                      placeholder={placeholder}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <SaveRevertForm form={form} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditMaterials({
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

  const placeholder = "e.g.\nExcavators\nBulldozers\nBackhoe Loaders";

  return (
    <Dialog>
      <div className="flex gap-4 items-center p-4 rounded border bg-background">
        <h2 className="text-base font-semibold grow text-left">
          Materials Status
        </h2>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Open
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        className="max-h-[90svh] h-[50rem] flex flex-col p-4 gap-4"
        id="edit-materials-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Materials Status
        </DialogTitle>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 grow"
            onSubmit={form.handleSubmit(async (data: ReportFormType) => {
              const newReport = await mutate(
                Actions.updateSiteReportDetails(report.id, data),
              );
              form.reset(newReport);
            })}
          >
            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? undefined}
                      className="h-full text-base leading-8 resize-none"
                      placeholder={placeholder}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <SaveRevertForm form={form} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditSitePersonel({
  report,
  mutate,
}: {
  report: SiteReportAll;
  mutate: KeyedMutator<SiteReportAll | undefined>;
}) {
  const form = useForm<ReportFormType>({
    resolver: zodResolver(reportFormSchema),
    values: report,
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 rounded border p-4 bg-background"
        onSubmit={form.handleSubmit(async (data: ReportFormType) => {
          await Actions.updateSiteReportDetails(report.id, data);
          const newReport = await mutate(); // TODO update from return value above
          form.reset(newReport);
        })}
      >
        <h3 className="font-semibold">Site Personel</h3>

        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="contractors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contractors</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? undefined}
                    className="min-h-10 h-10"
                    placeholder="eg. John Doe"
                    autoResize={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="engineers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engineers</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? undefined}
                    className="min-h-10 h-10"
                    placeholder="eg. John Doe"
                    autoResize={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workers</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? undefined}
                    className="min-h-10 h-10"
                    placeholder="eg. John Doe"
                    autoResize={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visitors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visitors</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? undefined}
                    className="min-h-10 h-10"
                    placeholder="eg. John Doe"
                    autoResize={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <SaveRevertForm form={form} />
        </div>
      </form>
    </Form>
  );
}

function EditSiteActivities({
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
    <Form {...form}>
      <form
        className="flex flex-col gap-4 rounded border p-4 bg-background"
        onSubmit={form.handleSubmit(async (data: ReportFormType) => {
          await Actions.updateSiteReportDetails(report.id, data);
          const newReport = await mutate(); // TODO update from return value above
          form.reset(newReport);
        })}
      >
        <h3 className="font-semibold">Site Activities</h3>
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? undefined}
                  className="h-36"
                  placeholder="eg. Excavation"
                />
              </FormControl>
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

export function EditReportDocument({
  siteId,
  reportId,
  sections,
}: {
  siteId?: number;
  reportId: number;
  sections?: string[];
}) {
  const {
    data: report,
    mutate,
    isLoading,
  } = useSWR(
    `/api/reports/${reportId}/details`, // api route doesn't really exist
    async () => Actions.getSiteReportDetails(reportId),
  );

  if (isLoading) return <p>loading...</p>;
  if (!report) notFound();

  return (
    <Card className="bg-cyan-50 border-2">
      <CardHeader className="flex flex-row justify-between">
        <h2 className="text-lg font-bold">Current Construction Activites</h2>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 items-start">
        {/* <EditReportEstimates report={report} mutate={mutate} /> */}
        {/* <EditReportDetails report={report} mutate={mutate} /> */}
        <div className="flex flex-col gap-4">
          <EditSiteActivities report={report} mutate={mutate} />
          <EditEquipment report={report} mutate={mutate} />
          <EditMaterials report={report} mutate={mutate} />
        </div>
        <EditSitePersonel report={report} mutate={mutate} />
      </CardContent>
    </Card>
  );
}
