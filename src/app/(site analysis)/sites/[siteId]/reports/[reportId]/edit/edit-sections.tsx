"use client";

import { useState, ChangeEvent } from "react";
import useSWR, { KeyedMutator } from "swr";
import { HaruFile, SiteReportSection } from "@/lib/types";
import { uploadReportSectionFile } from "@/lib/utils/upload";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/drizzle/schema";

import { LucideLoader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createInsertSchema } from "drizzle-zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

function UpdateSiteReportSectionFiles({
  siteId,
  reportId,
  section,
  sectionsMutate,
}: {
  siteId: number;
  reportId: number;
  section: SiteReportSection;
  sectionsMutate: KeyedMutator<SiteReportSection[]>;
}) {
  const { data: files, mutate: mutateFiles } = useSWR<HaruFile[]>(
    `/api/report/${reportId}/sections/${section.id}/files`, // api route doesn't really exist
    async () => {
      const files = await Actions.getSiteReportSectionFiles(section.id);
      return files || [];
    },
  );

  const [isUploading, setIsUploading] = useState(false);

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(targetFiles)) {
        const f = await uploadReportSectionFile(section.id, file);
        mutateFiles();
      }
      e.target.value = "";
    } catch (e) {
      toast({ description: `Error: ${e}` });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="border">
      <p>list of files:</p>
      <ul>{files?.map((f) => <li key={f.id}>{f.filename}</li>)}</ul>
      <Button asChild>
        <Label
          htmlFor={`upload-file-section-${section.id}`}
          // className="flex w-full h-full"
        >
          Add File to Section
          <Input
            type="file"
            id={`upload-file-section-${section.id}`}
            className="hidden"
            onChange={onChangeUploadFile}
            disabled={isUploading}
            multiple
          />
          {isUploading && <LucideLoader2 className="animate-spin h-4" />}
        </Label>
      </Button>
    </div>
  );
}

function UpdateSiteReportSection({
  siteId,
  reportId,
  section,
  sectionsMutate,
}: {
  siteId: number;
  reportId: number;
  section: SiteReportSection;
  sectionsMutate: KeyedMutator<SiteReportSection[]>;
}) {
  const formSchema = createInsertSchema(Schemas.siteReportSections1).pick({
    title: true,
    content: true,
  });
  type FormType = z.infer<typeof formSchema>;
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...section },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section {section.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
              Actions.updateSiteReportSection(section.id, data);
            })}
            className="grid grid-cols-3 gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>content</FormLabel>
                  <FormControl>
                    <Textarea
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                className="flex gap-2"
                disabled={form.formState.isSubmitting}
              >
                Save
                <LucideLoader2
                  className={cn(
                    "animate-spin w-4 h-4",
                    form.formState.isSubmitting ? "" : "hidden",
                  )}
                />
              </Button>
            </div>
          </form>
        </Form>

        <UpdateSiteReportSectionFiles
          siteId={siteId}
          reportId={reportId}
          section={section}
          sectionsMutate={sectionsMutate}
        />
      </CardContent>
    </Card>
  );
}

export function UpdateSiteReportSections({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const { data: sections, mutate } = useSWR<SiteReportSection[]>(
    `/api/report/${reportId}/sections`, // api route doesn't really exist
    async () => {
      const sections = await Actions.getSiteReportSections(reportId);
      return sections || [];
    },
  );

  return (
    <div>
      {sections?.map((s) => (
        <UpdateSiteReportSection
          siteId={siteId}
          reportId={reportId}
          section={s}
          sectionsMutate={mutate}
          key={`UpdateSiteReportSection-${s.id}`}
        />
      ))}
      <div>
        <Button
          onClick={() => {
            Actions.addSiteReportSection(reportId, {
              title: "title",
              content: "content",
            });
            mutate();
          }}
        >
          Add Section
        </Button>
      </div>
    </div>
  );
}
