"use client";

import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { Site, SiteNew } from "@/lib/types";
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
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SaveRevertForm } from "@/components/save-revert-form";
import { LucideEdit } from "lucide-react";
import { useRef } from "react";

function EditSiteTitleForm({ site }: { site: Site }) {
  const editTitleSchema = createInsertSchema(Schemas.sites1).pick({
    title: true,
  }) satisfies ZodType<SiteNew>;

  type EditTitleSchema = z.infer<typeof editTitleSchema>;

  const form = useForm<EditTitleSchema>({
    resolver: zodResolver(editTitleSchema),
    defaultValues: { title: site.title || "" },
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: EditTitleSchema) => {
          const newData = await Actions.updateSite(site.id, data);
          form.reset(newData);
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grow max-w-2xl">
              {/* <FormLabel>New Title</FormLabel> */}
              <Input {...field} value={field.value || ""} />
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

export function EditSiteTitle({ site }: { site: Site }) {
  return (
    <div className="grow flex gap-4">
      <h1 className="text-2xl font-semibold">
        Site {site.id}: {site?.title}
      </h1>

      <Dialog>
        <DialogTrigger asChild className="">
          <Button variant="outline" size="icon" className="opacity-50">
            <LucideEdit />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit Title of this Site</DialogTitle>
          <EditSiteTitleForm site={site} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
