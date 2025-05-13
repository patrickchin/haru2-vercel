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
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SaveRevertForm } from "@/components/save-revert-form";
import { LucideEdit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

function EditSiteDescriptionForm({ site }: { site: SiteDetails }) {
  const editDescriptionSchema = createInsertSchema(Schemas.sites1).pick({
    description: true,
  }) satisfies ZodType<SiteDetailsNew>;

  type EditDescriptionSchema = z.infer<typeof editDescriptionSchema>;

  const form = useForm<EditDescriptionSchema>({
    resolver: zodResolver(editDescriptionSchema),
    defaultValues: { description: site.description || "" },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: EditDescriptionSchema) => {
          const newData = await Actions.updateSiteDetails(site.id, data);
          form.reset(newData);
        })}
        className="flex flex-col gap-4 h-[80dvh]"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="grow">
              {/* <FormLabel>New Description</FormLabel> */}
              <Textarea
                {...field}
                value={field.value || ""}
                className="resize-none h-full"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <DialogClose className="hidden" ref={closeRef} />
          <SaveRevertForm
            form={form}
            onSaveClick={() => closeRef.current?.click()}
          />
        </div>
      </form>
    </Form>
  );
}

export function EditSiteDescription({ site }: { site: SiteDetails }) {
  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button variant="outline" size="icon">
          <LucideEdit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Description of this Site</DialogTitle>
        <EditSiteDescriptionForm site={site} />
      </DialogContent>
    </Dialog>
  );
}
