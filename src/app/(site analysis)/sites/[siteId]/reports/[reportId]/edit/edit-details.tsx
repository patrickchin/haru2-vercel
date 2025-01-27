"use client";

import useSWR, { KeyedMutator } from "swr";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { SiteDetails, SiteReportAll } from "@/lib/types/site";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import { LucideCuboid, LucideForklift, LucideLoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SaveRevertForm } from "@/components/save-revert-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EditUsedMaterialsForm,
  EditInventoryMaterialsForm,
} from "./edit-materials-form";
import {
  EditUsedEquipmentForm,
  EditInventoryEquipmentForm,
} from "./edit-equipment-form";
import { currencies } from "@/lib/constants";

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
        <CardTitle>Current Budget and Timeline Estimates</CardTitle>
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
  site,
  report,
}: {
  site: SiteDetails;
  report: SiteReportAll;
}) {
  return (
    <Dialog>
      <div className="flex gap-4 items-center p-4 rounded border bg-background">
        <h2 className="text-base font-semibold grow text-left">
          Equipment Used
        </h2>
        <DialogTrigger asChild>
          <Button variant="outline">
            Open <LucideForklift />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        className="max-h-[90svh] h-[50rem] w-[70rem] max-w-full flex flex-col p-4 gap-4"
        id="edit-equipment-used-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Equipment Used
        </DialogTitle>

        <EditUsedEquipmentForm site={site} reportId={report.id} />
      </DialogContent>
    </Dialog>
  );
}

function EditMaterials({
  site,
  report,
}: {
  site: SiteDetails;
  report: SiteReportAll;
}) {
  return (
    <Dialog>
      <div className="flex gap-4 items-center p-4 rounded border bg-background">
        <h2 className="text-base font-semibold grow text-left">
          Materials Used
        </h2>
        <DialogTrigger asChild>
          <Button variant="outline">
            Open <LucideCuboid />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent
        className="max-h-[90svh] h-[50rem] w-[70rem] max-w-full flex flex-col p-4 gap-4"
        id="edit-materials-used-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Materials Used
        </DialogTitle>

        <EditUsedMaterialsForm site={site} reportId={report.id} />
      </DialogContent>
    </Dialog>
  );
}

function EditSitePersonnel({
  report,
  mutate,
}: {
  report: SiteReportAll;
  mutate: KeyedMutator<SiteReportAll | undefined>;
}) {
  const schema = reportFormSchema
    .pick({
      contractors: true,
      engineers: true,
      numberOfWorkers: true,
      workersHours: true,
      workersCost: true,
      workersCostCurrency: true,
      visitors: true,
    })
    .extend({
      numberOfWorkers: z.coerce.number().nullable(),
    });
  type SchemaType = z.infer<typeof schema>;
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      contractors: report.contractors,
      engineers: report.engineers,
      numberOfWorkers: report.numberOfWorkers,
      workersHours: report.workersHours,
      workersCost: report.workersCost,
      workersCostCurrency: report.workersCostCurrency,
      visitors: report.visitors,
    },
  });

  const numberOfWorkers = useWatch({
    control: form.control,
    name: "numberOfWorkers",
  });
  const workersHours = useWatch({
    control: form.control,
    name: "workersHours",
  });
  const workersCost = useWatch({ control: form.control, name: "workersCost" });

  const totalCost =
    (numberOfWorkers ?? 0) *
    (workersHours ? parseFloat(workersHours) : 0) *
    (workersCost ? parseFloat(workersCost) : 0);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 rounded border p-4 bg-background"
        onSubmit={form.handleSubmit(async (data: SchemaType) => {
          const newReport = await mutate(
            Actions.updateSiteReportDetails(report.id, data),
            { revalidate: false },
          );
          form.reset(newReport);
        })}
      >
        <h3 className="font-semibold">Site Personnel</h3>

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

          <FormLabel>Workers</FormLabel>
          <div className="flex gap-2 items-end">
            <FormField
              control={form.control}
              name="numberOfWorkers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal">Number</FormLabel>
                  <Input type="number" {...field} value={field.value ?? ""} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workersHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal">Total Hours</FormLabel>
                  <Input
                    type="number"
                    step="0.5"
                    {...field}
                    value={field.value ?? ""}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <FormField
                control={form.control}
                name="workersCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Cost Per Hour</FormLabel>

                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      className="rounded-r-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workersCostCurrency"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? ""}
                    >
                      <SelectTrigger className="rounded-l-none border-l-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem value={currency} key={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="text-sm">
            Total Cost: {totalCost.toLocaleString()}{" "}
            {form.getValues("workersCostCurrency")}
          </div>
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
  site,
  report,
}: {
  site: SiteDetails;
  report: SiteReportAll;
}) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Open Materials <LucideCuboid />
          </Button>
        </DialogTrigger>

        <DialogContent
          className={cn(
            "min-h-96 max-h-[90svh] h-[50rem]",
            "min-w-80 max-w-[90svw] w-[60rem]",
            "flex flex-col",
          )}
        >
          <DialogTitle className="text-lg font-semibold">
            Materials Storage
          </DialogTitle>
          <DialogDescription className="sr-only">
            Materials Storage Table
          </DialogDescription>
          <EditInventoryMaterialsForm site={site} reportId={report.id} />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Open Equipment <LucideForklift />
          </Button>
        </DialogTrigger>

        <DialogContent
          className={cn(
            "min-h-96 max-h-[90svh] h-[50rem]",
            "min-w-80 max-w-[90svw] w-[60rem]",
            "flex flex-col",
          )}
        >
          <DialogTitle className="text-lg font-semibold">
            Equipment Storage
          </DialogTitle>
          <DialogDescription className="sr-only">
            Equipment Storage Table
          </DialogDescription>
          <EditInventoryEquipmentForm site={site} reportId={report.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function EditReportDocument({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const {
    data: report,
    mutate,
    isLoading,
  } = useSWR(
    `/api/reports/${reportId}/details`, // api route doesn't really exist
    async () => Actions.getSiteReportDetails(reportId),
  );
  const { data: site, isLoading: siteLoading } = useSWR(
    `/api/site/${siteId}/details`, // api route doesn't really exist
    async () => Actions.getSiteDetails(siteId),
  );

  return (
    <>
      <Card className="bg-muted">
        <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6">
          <CardTitle className="text-lg grow text-left">
            Inventory and Storage
          </CardTitle>
          {isLoading ? (
            <div className="flex items-center justify-center grow">
              <LucideLoaderCircle className="animate-spin" />
            </div>
          ) : !report ? (
            <div className="flex items-center justify-center grow">
              Error loading report
            </div>
          ) : !site ? (
            <div className="flex items-center justify-center grow col-span-2">
              Error loading site
            </div>
          ) : (
            <EditInventory site={site} report={report} />
          )}
        </CardContent>
      </Card>

      <Card className="bg-cyan-50 dark:bg-cyan-950">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-lg">
            Current Construction Activities
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* <EditReportEstimates report={report} mutate={mutate} /> */}
          {/* <EditReportDetails report={report} mutate={mutate} /> */}
          {isLoading || siteLoading ? (
            <div className="flex items-center justify-center grow col-span-2">
              <LucideLoaderCircle className="animate-spin" />
            </div>
          ) : !report ? (
            <div className="flex items-center justify-center grow col-span-2">
              Error loading report
            </div>
          ) : !site ? (
            <div className="flex items-center justify-center grow col-span-2">
              Error loading site
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <EditSiteActivities report={report} mutate={mutate} />
                <EditMaterials site={site} report={report} />
                <EditEquipment site={site} report={report} />
              </div>
              <EditSitePersonnel report={report} mutate={mutate} />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
