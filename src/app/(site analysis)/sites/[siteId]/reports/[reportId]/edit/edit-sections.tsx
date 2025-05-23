"use client";

import { useState, ChangeEvent } from "react";
import useSWR from "swr";
import { HaruFile, SiteReportSection } from "@/lib/types";
import { uploadReportSectionFile } from "@/lib/utils/upload";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Actions from "@/lib/actions";
import * as Schemas from "@/db/schema";

import {
  LucideLoader2,
  LucideLoaderCircle,
  LucidePlus,
  LucideMic,
  LucideStopCircle,
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
import { Textarea } from "@/components/ui/textarea";
import { SaveRevertForm } from "@/components/save-revert-form";
import { DeleteSectionButton } from "./delete-section";
import { InputWithDefaults } from "@/components/input-with-defaults";
import { FileListTable } from "@/components/file-list-table";

function VoiceNoteRecorder({
  sectionId,
  mutateFiles,
}: {
  sectionId: number;
  mutateFiles: () => Promise<any>;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.ondataavailable = (e) => {
        console.log("Audio chunk available", e.data);
        if (e.data.size > 0) setAudioChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = async () => {
        console.log("Recording stopped", audioChunks);
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        await uploadVoiceNote(audioBlob);
      };
      recorder.start();
      setIsRecording(true);
    } catch (e) {
      toast({ description: "Microphone access denied or unavailable." });
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }

  async function uploadVoiceNote(blob: Blob) {
    setIsUploadingVoice(true);
    try {
      const file = new File([blob], `voice-note-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      await uploadReportSectionFile(sectionId, file);
      await mutateFiles();
      toast({ description: "Voice note uploaded successfully." });
    } catch (e) {
      toast({ description: `Voice note upload error: ${e}` });
    } finally {
      setIsUploadingVoice(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "secondary"}
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isUploadingVoice}
        aria-label={isRecording ? "Stop Recording" : "Start Recording"}
      >
        {isRecording ? (
          <LucideStopCircle className="w-5 h-5 animate-pulse" />
        ) : (
          <LucideMic className="w-5 h-5" />
        )}
      </Button>
      <span className="text-sm">
        {isRecording
          ? "Recording..."
          : isUploadingVoice
            ? "Uploading voice note..."
            : "Record Voice Note"}
      </span>
    </div>
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
    `/api/report/${reportId}/sections/${section.id}/files`,
    async () => {
      const files = await Actions.listSiteReportSectionFiles(section.id);
      return files || [];
    },
  );

  async function handleFileDelete(file: HaruFile) {
    try {
      await Actions.deleteSiteReportFile({ reportId, fileId: file.id });
      await mutateFiles();
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
        <VoiceNoteRecorder sectionId={section.id} mutateFiles={mutateFiles} />
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
    // undefined,

    "Materials Quality Check",
    "Materials and Equipment",
    "Security",
    "Environment",
    // undefined,

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
                    <FormControl>
                      <InputWithDefaults
                        defaultOptions={sectionTitles}
                        value={field.value || ""}
                        className="grow max-w-[30rem] md:text-base"
                        placeholder="Enter a Section Title ..."
                        name={field.name}
                        onChange={field.onChange}
                      />
                    </FormControl>

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
