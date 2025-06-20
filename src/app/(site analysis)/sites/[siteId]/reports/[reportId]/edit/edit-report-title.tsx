"use client";

import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SaveRevertForm } from "@/components/save-revert-form";
import { useRef } from "react";
import { SiteReport, SiteReportNew } from "@/lib/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

function EditReportTitleForm({ report }: { report: SiteReport }) {
  const editTitleSchema = createInsertSchema(Schemas.siteReports1).pick({
    title: true,
  }) satisfies ZodType<SiteReportNew>;

  type EditTitleSchema = z.infer<typeof editTitleSchema>;

  const form = useForm<EditTitleSchema>({
    resolver: zodResolver(editTitleSchema),
    defaultValues: { title: report.title || "" },
  });

  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // add ref for input

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: EditTitleSchema) => {
          const newData = await Actions.updateSiteReport(report.id, data);
          form.reset(newData);
          inputRef.current?.blur(); // unfocus input after submit
        })}
        className="flex gap-4 grow"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grow">
              <Input
                {...field}
                value={field.value || ""}
                className="md:text-2xl"
                ref={inputRef} // attach ref to input
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          <SaveRevertForm
            form={form}
            onSaveClick={() => closeRef.current?.click()}
          />
        </div>
      </form>
    </Form>
  );
}

export function EditReportTitle({ report }: { report: SiteReport }) {
  return (
    <Card className="flex flex-row p-6 gap-4 items-center">
      <CardTitle>Report Title</CardTitle>
      <CardContent className="p-0 grow">
        <EditReportTitleForm report={report} />
      </CardContent>
    </Card>
  );
}
