"use client";

import { useState, ChangeEvent } from "react";
import useSWR, { KeyedMutator } from "swr";
import { HaruFile, SiteReportSection } from "@/lib/types";
import { uploadReportSectionFile } from "@/lib/utils/upload";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import Image from "next/image";
import {
  LucideChevronDown,
  LucideLoader2,
  LucideLoaderCircle,
  LucidePlus,
  LucideTrash2,
  LucideVideo,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createInsertSchema } from "drizzle-zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteSectionButton } from "./delete-section";

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
              <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.uploadedAt?.toDateString() ?? "--"}
              </TableCell>
              <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.uploader?.name ?? "--"}
              </TableCell>
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
  reportId,
  section,
}: {
  reportId: number;
  section: SiteReportSection;
}) {
  const { data: files, mutate: mutateFiles } = useSWR<HaruFile[]>(
    `/api/report/${reportId}/sections/${section.id}/files`, // api route doesn't really exist
    async () => {
      const files = await Actions.listSiteReportSectionFiles(section.id);
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
        <h3 className="font-medium">Section Files</h3>
        <Button asChild variant="secondary">
          <Label
            htmlFor={`upload-file-section-${section.id}`}
            className="rounded hover:cursor-pointer flex gap-2"
          >
            <Input
              type="file"
              id={`upload-file-section-${section.id}`}
              accept="image/*"
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
      {files && files.length > 0 && (
        <FileListTable
          files={files}
          handleFileDelete={handleFileDelete}
          type={"image"}
        />
      )}
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
  sectionsMutate: () => Promise<any>;
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

  const sectionTitles = [
    "Site Layout and Access",
    "Current Construction Activities",
    "Health and Safety",
    "Site Personnel",
    "Site Conditions",
    null,

    "Materials Quality Check",
    "Materials and Equipment",
    "Security",
    "Environment",
    null,

    "Work Quality",
    "Visitor and Public Interaction",
    "Legal and Compliance",
  ];

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
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grow">
                    <div className="w-full flex flex-col md:flex-row gap-3">
                      <FormControl>
                        <Input
                          className="grow max-w-[30rem] md:text-base"
                          placeholder="Enter a Section Title ..."
                          name={field.name}
                          onChange={field.onChange}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <DropdownMenu modal={false}>
                        <Button asChild variant="outline">
                          <DropdownMenuTrigger>
                            Select Default Title <LucideChevronDown />
                          </DropdownMenuTrigger>
                        </Button>
                        <DropdownMenuContent className="p-4">
                          {sectionTitles.map((t, i) =>
                            t ? (
                              <DropdownMenuItem
                                key={i}
                                onSelect={() =>
                                  form.setValue(field.name, t, {
                                    shouldDirty: true,
                                  })
                                }
                              >
                                {t}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuSeparator key={i} />
                            ),
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="hidden md:flex gap-3 justify-end">
                <SaveRevertForm form={form} />
                <DeleteSectionButton
                  sectionId={section.id}
                  disabled={false}
                  onSubmit={sectionsMutate}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value || ""}
                      className="min-h-36"
                      autoResize={true}
                      placeholder="Enter section details ..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex md:hidden gap-3 justify-end mb-3">
              <SaveRevertForm form={form} />
              <DeleteSectionButton
                sectionId={section.id}
                disabled={false}
                onSubmit={sectionsMutate}
              />
            </div>
          </form>
        </Form>

        <UpdateSiteReportSectionFiles reportId={reportId} section={section} />
      </CardContent>
    </Card>
  );
}

export function EditReportSections({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const {
    data: sections,
    mutate,
    isLoading,
  } = useSWR(`/api/report/${reportId}/sections`, async () =>
    Actions.listSiteReportSections(reportId),
  );

  return (
    <div className="flex flex-col gap-4">
      {sections &&
        sections?.map((s) => (
          <UpdateSiteReportSection
            siteId={siteId}
            reportId={reportId}
            section={s}
            sectionsMutate={mutate}
            key={`UpdateSiteReportSection-${s.id}`}
          />
        ))}
      <Card>
        <CardContent className="p-6 py-12 flex flex-col gap-4 items-center">
          <Button
            variant="secondary"
            onClick={async () => {
              await mutate(Actions.addSiteReportSection(reportId, {}));
            }}
            disabled={isLoading}
          >
            Add Detailed Section{" "}
            {isLoading ? (
              <LucideLoaderCircle className="animate-spin" />
            ) : (
              <LucidePlus />
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
