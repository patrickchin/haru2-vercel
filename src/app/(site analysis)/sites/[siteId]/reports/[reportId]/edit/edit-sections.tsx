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
import * as Schemas from "@/db/schema";

import Image from "next/image";
import {
  LucideLoader2,
  LucidePlus,
  LucideTrash2,
  LucideVideo,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/hooks/use-toast";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import prettyBytes from "pretty-bytes";
import { SaveRevertForm } from "@/components/save-revert-form";
import { Separator } from "@/components/ui/separator";
import { InfoBox } from "@/components/info-box";

// DUPLICATED FROM edit-upload.tsx can be improved
function FileListTable({
  files,
  handleFileDelete,
  type,
}: {
  files: HaruFile[] | undefined;
  handleFileDelete: (file: HaruFile) => Promise<void>;
  type: string;
}) {
  return (
    <Table className="border rounded">
      <TableHeader>
        <TableRow className="[&>th]:border-r">
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead className="text-nowrap">File Name</TableHead>
          <TableHead className="text-nowrap">File Size</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files && files.length > 0 ? (
          files?.map((file, i) => (
            <TableRow key={file.id} className="[&>td]:border-r">
              <TableCell className="w-8 text-center">{i + 1}</TableCell>
              <TableCell className="w-12 h-12 overflow-ellipsis overflow-hidden text-nowrap p-0 relative">
                {file.type?.startsWith("image/") && (
                  <TooltipProvider
                    delayDuration={0}
                    disableHoverableContent={true}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-full relative flex justify-center items-center border-4 border-background">
                          <Image
                            src={file.url || ""}
                            alt={""}
                            width={40}
                            height={40}
                            className="object-cover absolute"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="">
                        <Image
                          src={file.url || ""}
                          alt={""}
                          width={384}
                          height={384}
                          className="object-contain"
                        />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {file.type?.startsWith("video/") && (
                  <div className="w-full h-full flex justify-center items-center">
                    <LucideVideo className="h-5 w-5" />
                  </div>
                )}
              </TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden text-nowrap">
                {file.filename}
              </TableCell>
              {/* <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.uploadedAt?.toDateString() ?? "unkonwn"}
              </TableCell> */}
              {/* <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.uploader?.name ?? "unkonwn"}
              </TableCell> */}
              <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.filesize && prettyBytes(file.filesize)}
              </TableCell>
              <TableCell className="w-12">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline">
                      <LucideTrash2 className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Delete File</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the file{" "}
                      <strong>{file.filename}</strong>?
                    </DialogDescription>
                    <div className="flex gap-2 justify-end">
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          onClick={() => handleFileDelete(file)}
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={999} className="h-24 text-center">
              No {type}s have been uploaded
            </TableCell>
            <TableHead></TableHead>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

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

  async function handleFileDelete(file: HaruFile) {
    try {
      await Actions.deleteSiteReportFile({ reportId, fileId: file.id });
      await mutateFiles(); // Refresh the file list after deletion
      toast({ description: `File deleted successfully: ${file.filename}` });
    } catch (e) {
      toast({ description: `Delete Error: ${e}` });
    }
  }

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold">Section Files</h3>
        <Button asChild>
          <Label
            htmlFor={`upload-file-section-${section.id}`}
            className="rounded hover:cursor-pointer flex gap-2"
          >
            <Input
              type="file"
              id={`upload-file-section-${section.id}`}
              className="hidden"
              onChange={onChangeUploadFile}
              disabled={isUploading}
              multiple
            />
            <span className="capitalize">Upload Section Image</span>
            {isUploading ? (
              <LucideLoader2 className="animate-spin h-5 w-5" />
            ) : (
              <LucidePlus className="w-4 h-4" />
            )}
          </Label>
        </Button>
      </div>
      <FileListTable
        files={files}
        handleFileDelete={handleFileDelete}
        type={"image"}
      />
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
    defaultValues: {
      title: section.title || "",
      content: section.content || "",
    },
  });

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              const newSection = await Actions.updateSiteReportSection(
                section.id,
                data,
              );
              await sectionsMutate();
              form.reset(newSection);
            })}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value || ""}
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
                  <FormLabel>Section Content</FormLabel>
                  <FormControl>
                    <Textarea
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value || ""}
                      autoResize={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 flex justify-end">
              <SaveRevertForm form={form} />
            </div>
          </form>
        </Form>

        <Separator />

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
      const sections = await Actions.listSiteReportSections(reportId);
      return sections || [];
    },
  );

  return (
    <div className="flex flex-col gap-4">
      {sections && sections.length > 0 ? (
        sections?.map((s) => (
          <UpdateSiteReportSection
            siteId={siteId}
            reportId={reportId}
            section={s}
            sectionsMutate={mutate}
            key={`UpdateSiteReportSection-${s.id}`}
          />
        ))
      ) : (
        <InfoBox className="text-base p-6 rounded-lg">
          You can create a more detailed site report by adding new sections and
          attaching photos.
        </InfoBox>
      )}
      <div>
        <Button
          onClick={async () => {
            await Actions.addSiteReportSection(reportId, {});
            await mutate();
          }}
        >
          Add Section
        </Button>
      </div>
    </div>
  );
}
