"use client";

import { notFound } from "next/navigation";
import useSWR, { KeyedMutator } from "swr";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { SiteReportAll } from "@/lib/types/site";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const schema = reportFormSchema.pick({
    budget: true,
    timeline: true,
    spent: true,
    completion: true,
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      budget: report.budget || "",
      timeline: report.timeline || "",
      spent: report.spent || "",
      completion: report.completion || null,
    },
  });

  return (
    <Card className="bg-yellow-50">
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
              const newReport = await mutate(
                Actions.updateSiteReportDetails(report.id, data),
                { revalidate: false },
              );
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
  const schema = reportFormSchema.pick({ equipmentUsed: true });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { equipmentUsed: report.equipmentUsed || "" },
  });

  const placeholder =
    "e.g.\nSand - 10kg bags x 10\nGravel - 10kg bags x 8\nCrushed Stone ...";

  return (
    <Dialog>
      <div className="flex gap-4 items-center p-4 rounded border bg-background">
        <h2 className="text-base font-semibold grow text-left">
          Equipment Used
        </h2>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Open
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        className="max-h-[90svh] h-[50rem] flex flex-col p-4 gap-4"
        id="edit-equipment-used-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Equipment Used
        </DialogTitle>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 grow"
            onSubmit={form.handleSubmit(async (data: ReportFormType) => {
              const newReport = await mutate(
                Actions.updateSiteReportDetails(report.id, data),
                { revalidate: false },
              );
              form.reset(newReport);
            })}
          >
            <FormField
              control={form.control}
              name="equipmentUsed"
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
  const schema = reportFormSchema.pick({ materialsUsed: true });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { materialsUsed: report.materialsUsed || "" },
  });

  const placeholder = "e.g.\nExcavators\nBulldozers\nBackhoe Loaders";

  return (
    <Dialog>
      <div className="flex gap-4 items-center p-4 rounded border bg-background">
        <h2 className="text-base font-semibold grow text-left">
          Materials Used
        </h2>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Open
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        className="max-h-[90svh] h-[50rem] flex flex-col p-4 gap-4"
        id="edit-materials-used-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Materials Used
        </DialogTitle>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 grow"
            onSubmit={form.handleSubmit(async (data: ReportFormType) => {
              const newReport = await mutate(
                Actions.updateSiteReportDetails(report.id, data),
                { revalidate: false },
              );
              form.reset(newReport);
            })}
          >
            <FormField
              control={form.control}
              name="materialsUsed"
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
  const schema = reportFormSchema.pick({
    contractors: true,
    engineers: true,
    workers: true,
    visitors: true,
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      contractors: report.contractors || "",
      engineers: report.engineers || "",
      workers: report.workers || "",
      visitors: report.visitors || "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 rounded border p-4 bg-background"
        onSubmit={form.handleSubmit(async (data: ReportFormType) => {
          const newReport = await mutate(
            Actions.updateSiteReportDetails(report.id, data),
            { revalidate: false },
          );
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
  const schema = reportFormSchema.pick({ activity: true });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { activity: report.activity || "" },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 rounded border p-4 bg-background"
        onSubmit={form.handleSubmit(async (data: ReportFormType) => {
          const newReport = await mutate(
            Actions.updateSiteReportDetails(report.id, data),
            { revalidate: false },
          );
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

function EditInventory({
  report,
  mutate,
}: {
  report: SiteReportAll;
  mutate: KeyedMutator<SiteReportAll | undefined>;
}) {
  const materialsSchema = reportFormSchema.pick({
    materialsInventory: true,
  });
  const materialsForm = useForm<z.infer<typeof materialsSchema>>({
    resolver: zodResolver(materialsSchema),
    defaultValues: {
      materialsInventory: report.materialsInventory || "",
    },
  });

  const equipmentSchema = reportFormSchema.pick({
    equipmentInventory: true,
  });
  const equipmentForm = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      equipmentInventory: report.equipmentInventory || "",
    },
  });

  const placeholder =
    "e.g.\nSand - 10kg bags x 10\nGravel - 10kg bags x 8\nCrushed Stone ...";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Open
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "min-h-96 max-h-[90svh] h-[50rem]",
          "min-w-80 max-w-[90svw] w-[60rem]",
          "overflow-hidden",
          "grid grid-cols-2 gap-4",
        )}
      >
        <Form {...materialsForm}>
          <form
            className="grow flex flex-col gap-4"
            onSubmit={materialsForm.handleSubmit(
              async (data: ReportFormType) => {
                const newReport = await mutate(
                  Actions.updateSiteReportDetails(report.id, data),
                  { revalidate: false },
                );
                materialsForm.reset(newReport);
              },
            )}
          >
            <DialogTitle className="text-lg font-semibold">
              Materials Storage
            </DialogTitle>

            <FormField
              control={materialsForm.control}
              name="materialsInventory"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? undefined}
                      className="h-full text-base leading-8 resize-none"
                      placeholder={
                        "e.g.\n" +
                        "Cement - 50kg - 20 bags - New condition\n" +
                        "Steel rods - 70 bundles - Good condition\n" +
                        "Cement bricks - 300 bricks - Bad condition\n"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <SaveRevertForm form={materialsForm} />
            </div>
          </form>
        </Form>

        <Form {...equipmentForm}>
          <form
            className="grow flex flex-col gap-4"
            onSubmit={equipmentForm.handleSubmit(
              async (data: ReportFormType) => {
                const newReport = await mutate(
                  Actions.updateSiteReportDetails(report.id, data),
                  { revalidate: false },
                );
                equipmentForm.reset(newReport);
              },
            )}
          >
            <div className="flex flex-col gap-4 h-full">
              <DialogTitle className="text-lg font-semibold">
                Equipment Storage
              </DialogTitle>
              <FormField
                control={equipmentForm.control}
                name="equipmentInventory"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? undefined}
                        className="h-full text-base leading-8 resize-none"
                        placeholder={
                          "e.g.\n" +
                          "Excavators - 1 - New condition\n" +
                          "Dump Trucks - 3 - Good condition\n" +
                          "Pick Axes - 12 - Bad condition\n" +
                          "Shovels - 15 - New condition\n"
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <SaveRevertForm form={equipmentForm} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
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
    <>
      <Card className="bg-cyan-50">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-lg font-bold">
            Current Construction Activites
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* <EditReportEstimates report={report} mutate={mutate} /> */}
          {/* <EditReportDetails report={report} mutate={mutate} /> */}
          <div className="flex flex-col gap-4">
            <EditSiteActivities report={report} mutate={mutate} />
            <EditMaterials report={report} mutate={mutate} />
            <EditEquipment report={report} mutate={mutate} />
          </div>
          <EditSitePersonel report={report} mutate={mutate} />
        </CardContent>
      </Card>

      <Card className="bg-muted">
        <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6">
          <CardTitle className="text-base font-semibold grow text-left">
            Inventory and Storage
          </CardTitle>
          <EditInventory report={report} mutate={mutate} />
        </CardContent>
      </Card>
    </>
  );
}
