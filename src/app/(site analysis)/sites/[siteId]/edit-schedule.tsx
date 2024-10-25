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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function EditSiteScheduleForm({ site }: { site: SiteDetails }) {
  const editScheduleSchema = createInsertSchema(Schemas.siteDetails1).pick({
    address: true,
    description: true,
  }) satisfies ZodType<SiteDetailsNew>;

  type EditScheduleSchema = z.infer<typeof editScheduleSchema>;

  const form = useForm<EditScheduleSchema>({
    resolver: zodResolver(editScheduleSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: EditScheduleSchema) => {
            Actions.updateSiteDetails();
          //   await Actions.addSiteMemberByEmail({ siteId, email: data.email });
        })}
        className="flex gap-4 items-end"
      >
        <FormField
          control={form.control}
          name="completion"
          render={({ field }) => (
            <FormItem className="grow max-w-lg">
              <FormLabel>Add User</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Email address of the user to add"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex"></div>
      </form>

      <Table>
        <TableBody>
          <TableRow>
            <TableHead className="font-medium">Creation Date</TableHead>
            <TableCell>{site.createdAt?.toDateString() || "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">Start Date</TableHead>
            <TableCell>{site.startDate?.toDateString() ?? "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">End Date</TableHead>
            <TableCell>{site.endDate?.toDateString() ?? "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">Next Report Date</TableHead>
            <TableCell>
              {site.nextReportDate?.toDateString() ?? "Unknown"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">Supervision Schedule</TableHead>
            <TableCell>{site.schedule ?? "Unknown"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
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
