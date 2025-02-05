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
  LucideEraser,
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
import { InputDate } from "@/components/input-date";
import { dateDiffInDays } from "@/lib/utils";

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

function EditSitePersonnelForm({
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
  const workersCostPerDay = useWatch({
    control: form.control,
    name: "workersCostPerDay",
  });

  const durationDays =
    activity.startDate && activity.endOfDate
      ? dateDiffInDays(activity.startDate, activity.endOfDate) + 1
      : undefined;

  const totalCost =
    numberOfWorkers && workersCostPerDay && durationDays
      ? numberOfWorkers * parseFloat(workersCostPerDay) * durationDays
      : undefined;

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (data: SchemaType) => {
          const newReport = Actions.updateSiteActivity({
            activityId: activity.id,
            values: data,
          });
          await mutate();
          form.reset(await newReport);
        })}
      >
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
                <FormLabel className="font-normal">Hours Per Day</FormLabel>
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
                  <FormLabel className="font-normal">Cost Per Day</FormLabel>

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
          <div>
            Total Days: {durationDays ? durationDays?.toLocaleString() : "--"}
          </div>
          <div>
            Total Cost: {totalCost ? totalCost?.toLocaleString() : "--"}{" "}
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

function EditSitePersonnel({
  activity,
  mutate,
}: {
  activity: SiteActivity;
  mutate: KeyedMutator<any>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Personnel
          <LucideUsers />
        </Button>
      </DialogTrigger>

      <DialogContent
        // className="max-h-[90svh] h-[50rem] w-[70rem] max-w-full flex flex-col p-4 gap-4"
        id="edit-equipment-used-dialog-content"
      >
        <DialogTitle className="text-lg font-semibold">
          Activity Site Personnel
        </DialogTitle>
        {activity && (
          <EditSitePersonnelForm activity={activity} mutate={mutate} />
        )}
      </DialogContent>
    </Dialog>
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

function EditActivityNameForm({
  site,
  activity,
  mutate,
}: {
  site: any;
  activity: SiteActivity;
  mutate: KeyedMutator<any>;
}) {
  const activitySchema = createInsertSchema(Schemas.siteActivity1);
  const schema = activitySchema.pick({
    name: true,
    startDate: true,
    endOfDate: true,
  });
  type SchemaType = z.infer<typeof schema>;
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: activity.name || "",
      startDate: activity.startDate,
      endOfDate: activity.endOfDate,
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (data: SchemaType) => {
          const newActivity = await mutate(
            Actions.updateSiteActivity({
              activityId: activity.id,
              values: data,
            }),
          );
          form.reset(newActivity);
        })}
      >
        <div className="flex gap-3 items-center">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    className="md:text-base"
                    placeholder="Enter an Activity ..."
                    name={field.name}
                    onChange={field.onChange}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end col-span-2">
            <SaveRevertForm form={form} />
            <DeleteActivityButton
              activityId={activity.id}
              disabled={false}
              onSubmit={mutate}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <InputDate
                      field={field}
                      prefix={
                        <span className="text-sm font-semibold">
                          Start Date:{" "}
                        </span>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => form.setValue("startDate", null)}
            >
              <LucideEraser />
            </Button>
          </div>

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="endOfDate"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <InputDate
                      field={field}
                      prefix={
                        <span className="text-sm font-semibold">
                          End Date:{" "}
                        </span>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => form.setValue("endOfDate", null)}
            >
              <LucideEraser />
            </Button>
          </div>
        </div>

        <div className="grow grid grid-cols-3 gap-3">
          <EditUsedMaterials site={site} activityId={activity.id} />
          <EditUsedEquipment site={site} activityId={activity.id} />
          <EditSitePersonnel activity={activity} mutate={mutate} />
        </div>
      </form>
    </Form>
  );
}

function EditActivity({
  site,
  activityId,
}: {
  site: SiteDetails;
  activityId: number;
}) {
  const { data, mutate, isLoading } = useSWR(
    `/api/activity/${activityId}/details`,
    async () => Actions.getSiteReportActivity({ activityId }),
    { revalidateOnFocus: false },
  );

  return (
    <Card className="bg-cyan-50 dark:bg-cyan-950">
      <CardContent className="flex flex-col gap-4 p-6">
        {isLoading ? (
          <LucideLoader2 className="animate-spin" />
        ) : data ? (
          <EditActivityNameForm site={site} activity={data} mutate={mutate} />
        ) : null}
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
      {Array.isArray(activities) &&
        site &&
        activities.map((activity) => (
          <EditActivity
            key={activity.id}
            site={site}
            activityId={activity.id}
          />
        ))}

      <Card className="bg-cyan-50 dark:bg-cyan-950">
        <CardContent className="p-6 py-12 flex flex-col gap-4 items-center">
          <Button
            variant="secondary"
            onClick={async () => {
              await mutateActivities(
                Actions.addSiteActivity({ reportId, activity: {} }),
              );
            }}
          >
            Add Site Activity{" "}
            {activitiesLoading ? (
              <LucideLoaderCircle className="animate-spin" />
            ) : (
              <LucidePlus />
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
