"use client";
import { cn } from "@/lib/utils";

import { LucideChevronDown, LucideMoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SiteDetails,
  SiteReport,
  SiteReportBoth,
  SiteReportSection,
} from "@/lib/types/site";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const currentActivitesSchema = z.object({
  activity: z.string().min(1, "Activity is required"),
  contractors: z.string().min(1, "Contractor names are required"),
  engineers: z.string().min(1, "Engineer names are required"),
  workers: z.string().min(1, "Worker names are required"),
  visitors: z.string().optional(),
  materialsUsed: z.string().min(1, "Materials used are required"),
  equipmentsUsed: z.string().min(1, "Equipment used is required"),
});
export type CurrentActivitiesType = z.infer<typeof currentActivitesSchema>;

export const estimatedBudgetAndTimelineSchema = z.object({
  estimatedBudget: z.string().min(1, "Budget is required"),
  constructionTimeline: z.string().min(1, "Timeline is required"),
  budgetSpent: z.string().min(1, "Budget spent is required"),
  completionDate: z.string().min(1, "Completion date is required"),
});
export type EstimatedBudgetAndTimelineType = z.infer<
  typeof estimatedBudgetAndTimelineSchema
>;

interface EditReportDocumentProps {
  siteId?: number;
  reportId?: number;
  sections?: string[];
}
export async function EditReportDocument({
  siteId,
  reportId,
  sections,
}: EditReportDocumentProps) {
  const estimatedBudgetAndTimelineForm =
    useForm<EstimatedBudgetAndTimelineType>({
      resolver: zodResolver(estimatedBudgetAndTimelineSchema),
    });
  const currentActivitiesForm = useForm<CurrentActivitiesType>({
    resolver: zodResolver(currentActivitesSchema),
  });

  return (
    <div className={"flex flex-col gap-4 brightness-95"}>
      <Card className="bg-yellow-50 border-2">
        <CardHeader className="flex flex-row justify-between">
          <div className="text-lg font-bold">
            Current Budget and Timeline Estimates
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          <Form {...estimatedBudgetAndTimelineForm}>
            <form className="w-full">
              <div className="grid grid-cols-2 gap-6 w-full">
                <FormField
                  control={estimatedBudgetAndTimelineForm.control}
                  name="estimatedBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Construction Budget</FormLabel>
                      <FormControl>
                        <Input
                          name={field.name}
                          className="w-full"
                          placeholder="eg. $2,000,000.00"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={estimatedBudgetAndTimelineForm.control}
                  name="constructionTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Construction Timeline</FormLabel>
                      <FormControl>
                        <Input
                          name={field.name}
                          className=""
                          placeholder="eg. 215 days"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={estimatedBudgetAndTimelineForm.control}
                  name="budgetSpent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Spent</FormLabel>
                      <FormControl>
                        <Input
                          name={field.name}
                          className=""
                          placeholder="eg. $200,000.00"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={estimatedBudgetAndTimelineForm.control}
                  name="completionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Date</FormLabel>
                      <FormControl>
                        <Input
                          name={field.name}
                          className=""
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
      <Card className="bg-cyan-50 border-2">
        <CardHeader className="flex flex-row justify-between">
          <div className="text-lg font-bold">
            Current Construction Activites
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          <Form {...currentActivitiesForm}>
            <form className="w-full">
              <div className="basis-1/4 border p-4 bg-background space-y-2">
                <h6>Site Activity</h6>
                <FormField
                  control={currentActivitiesForm.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          name={field.name}
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
                    control={currentActivitiesForm.control}
                    name="contractors"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Contractors</FormLabel>
                        <FormControl>
                          <Input
                            name={field.name}
                            className=""
                            placeholder="eg. John Doe"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={currentActivitiesForm.control}
                    name="engineers"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Engineers</FormLabel>
                        <FormControl>
                          <Input
                            name={field.name}
                            className=""
                            placeholder="eg. John Doe"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={currentActivitiesForm.control}
                    name="workers"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Workers</FormLabel>
                        <FormControl>
                          <Input
                            name={field.name}
                            className=""
                            placeholder="eg. John Doe"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={currentActivitiesForm.control}
                    name="visitors"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Visitors</FormLabel>
                        <FormControl>
                          <Input
                            name={field.name}
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
                  control={currentActivitiesForm.control}
                  name="materialsUsed"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Textarea
                          name={field.name}
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
                  control={currentActivitiesForm.control}
                  name="equipmentsUsed"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Textarea
                          name={field.name}
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
    </div>
  );
}
