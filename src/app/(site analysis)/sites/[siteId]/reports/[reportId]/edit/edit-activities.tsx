"use client";

import useSWR, { KeyedMutator } from "swr";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { SiteActivity, SiteDetails } from "@/lib/types/site";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import {
  LucideCuboid,
  LucideForklift,
  LucideLoader2,
  LucideLoaderCircle,
  LucidePlus,
  LucideTrash2,
  LucideUsers,
} from "lucide-react";
import { currencies, getCountryCurrency } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditUsedMaterialsForm } from "./edit-materials-form";
import { EditUsedEquipmentForm } from "./edit-equipment-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function EditUsedEquipment({
  site,
  activityId,
}: {
  site: SiteDetails;
  activityId: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Equipment
          <LucideForklift />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-h-[90svh] h-[50rem] w-[70rem] max-w-full flex flex-col p-4 gap-4"
        id="edit-equipment-used-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Equipment Used
        </DialogTitle>

        <EditUsedEquipmentForm site={site} activityId={activityId} />
      </DialogContent>
    </Dialog>
  );
}

function EditUsedMaterials({
  site,
  activityId,
}: {
  site: SiteDetails;
  activityId: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Materials <LucideCuboid />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-h-[90svh] h-[50rem] w-[70rem] max-w-full flex flex-col p-4 gap-4"
        id="edit-materials-used-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Materials Used
        </DialogTitle>
        <EditUsedMaterialsForm
          defaultCurrency={getCountryCurrency(site.countryCode) ?? null}
          activityId={activityId}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditSitePersonnel({
  activity,
  mutate,
}: {
  activity: SiteActivity;
  mutate: KeyedMutator<any>;
}) {
  const activitySchema = createInsertSchema(Schemas.siteActivity1);
  const schema = activitySchema
    .pick({
      contractors: true,
      engineers: true,
      numberOfWorkers: true,
      workersHoursPerDay: true,
      workersCostPerDay: true,
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
      contractors: activity.contractors,
      engineers: activity.engineers,
      numberOfWorkers: activity.numberOfWorkers,
      workersHoursPerDay: activity.workersHoursPerDay,
      workersCostPerDay: activity.workersCostPerDay,
      workersCostCurrency: activity.workersCostCurrency,
      visitors: activity.visitors,
    },
  });

  const numberOfWorkers = useWatch({
    control: form.control,
    name: "numberOfWorkers",
  });
  const workersHoursPerDay = useWatch({
    control: form.control,
    name: "workersHoursPerDay",
  });
  const workersCostPerDay = useWatch({
    control: form.control,
    name: "workersCostPerDay",
  });

  const totalCost =
    (numberOfWorkers ?? 0) *
    (workersHoursPerDay ? parseFloat(workersHoursPerDay) : 0) *
    (workersCostPerDay ? parseFloat(workersCostPerDay) : 0);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 rounded border p-4 bg-background"
        onSubmit={form.handleSubmit(async (data: SchemaType) => {
          const newReport = Actions.updateSiteActivity({
            activityId: activity.id,
            values: data,
          });
          await mutate();
          form.reset(await newReport);
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
              name="workersHoursPerDay"
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
                name="workersCostPerDay"
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

function DeleteActivityButton({
  activityId,
  disabled,
  onSubmit,
}: {
  activityId: number;
  disabled: boolean;
  onSubmit: () => void;
}) {
  const form = useForm();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" disabled={disabled} className="flex gap-2">
          Delete
          {form.formState.isSubmitting ? (
            <LucideLoader2 className="animate-spin" />
          ) : (
            <LucideTrash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you would like to delete this activity?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async () => {
                await Actions.deleteSiteActivity(activityId);
                // onSubmit();
              })}
            >
              <Button variant="destructive" asChild>
                <AlertDialogAction type="submit">
                  Yes, Delete Activity
                  {form.formState.isSubmitting && (
                    <LucideLoader2 className="animate-spin h-4" />
                  )}
                </AlertDialogAction>
              </Button>
            </form>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditActivityName({
  activity,
  mutate,
}: {
  activity: SiteActivity;
  mutate: KeyedMutator<any>;
}) {
  const activitySchema = createInsertSchema(Schemas.siteActivity1);
  const schema = activitySchema.pick({ name: true });
  type SchemaType = z.infer<typeof schema>;
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { name: activity.name || "" },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (data: SchemaType) => {
          const newActivity = Actions.updateSiteActivity({
            activityId: activity.id,
            values: data,
          });
          await mutate();
          form.reset(await newActivity);
        })}
      >
        <div className="flex gap-2 items-end">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grow">
                <div className="flex flex-row gap-4">
                  <FormControl>
                    <Input
                      className="grow max-w-[30rem] md:text-base"
                      placeholder="Enter an Activity ..."
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value || ""}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <SaveRevertForm form={form} />
          <DeleteActivityButton
            activityId={activity.id}
            disabled={false}
            onSubmit={mutate}
          />
        </div>
      </form>
    </Form>
  );
}

function EditActivity({
  site,
  activity,
  mutateActivities,
}: {
  site: SiteDetails;
  activity: SiteActivity;
  mutateActivities: KeyedMutator<any>;
}) {
  return (
    <Card className="bg-cyan-50 dark:bg-cyan-950">
      <CardContent className="flex flex-col gap-4 p-6">
        <EditActivityName activity={activity} mutate={mutateActivities} />
        <div className="grid grid-cols-3 gap-4">
          <EditUsedMaterials site={site} activityId={activity.id} />
          <EditUsedEquipment site={site} activityId={activity.id} />

          <Button variant="outline" disabled>
            Personnel <LucideUsers />
          </Button>
        </div>

        {/* <div className="flex flex-col gap-4">
          <EditUsedMaterials site={site} activityId={activity.id} />
          <EditEquipment site={site} activityId={activity.id} />
        </div>
        <EditSitePersonnel activity={activity} mutate={mutateActivities} /> */}
      </CardContent>
    </Card>
  );
}

export function EditReportActivities({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const { data: report, isLoading: reportLoading } = useSWR(
    `/api/reports/${reportId}/details`, // api route doesn't really exist
    async () => Actions.getSiteReportDetails(reportId),
    { revalidateOnFocus: false },
  );
  const { data: site, isLoading: siteLoading } = useSWR(
    `/api/site/${siteId}/details`, // api route doesn't really exist
    async () => Actions.getSiteDetails(siteId),
    { revalidateOnFocus: false },
  );
  const {
    data: activities,
    mutate: mutateActivities,
    isLoading: activitiesLoading,
  } = useSWR(
    `/api/report/${reportId}/activities`,
    async () => Actions.listSiteReportActivities({ reportId }),
    { revalidateOnFocus: false },
  );

  return (
    <>
      {reportLoading || siteLoading || activitiesLoading ? (
        <div className="flex items-center justify-center grow col-span-2">
          <LucideLoaderCircle className="animate-spin" />
        </div>
      ) : !report || !site || !activities ? (
        <div className="flex items-center justify-center grow col-span-2">
          Error loading: {!!report}
          {!!site}
          {!!activities}
        </div>
      ) : activities.length == 0 ? (
        <div className="flex items-center justify-center grow col-span-2">
          No activities
        </div>
      ) : (
        activities.map((activity) => (
          <EditActivity
            key={activity.id}
            site={site}
            activity={activity}
            mutateActivities={mutateActivities}
          />
        ))
      )}

      <Card className="bg-cyan-50 dark:bg-cyan-950">
        <CardContent className="p-6 py-12 flex flex-col gap-4 items-center">
          <Button
            variant="secondary"
            onClick={async () => {
              await Actions.addSiteActivity({ reportId, activity: {} });
              mutateActivities();
            }}
          >
            Add Site Activity <LucidePlus />
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
