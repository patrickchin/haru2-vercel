"use client";

import { useState, ChangeEvent } from "react";
import useSWR from "swr";
import { HaruFile, SiteReportSection } from "@/lib/types";
import { uploadReportSectionFile } from "@/lib/utils/upload";
import * as Actions from "@/lib/actions";

import { LucideLoader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function UpdateSiteReportSection({
  siteId,
  reportId,
  section,
}: {
  siteId: number;
  reportId: number;
  section: SiteReportSection;
}) {
  const { data: files, mutate } = useSWR<HaruFile[]>(
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
        mutate();
      }
      e.target.value = "";
    } catch (e) {
      toast({ description: `Error: ${e}` });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Section {section.id}: {section.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>list of files:</p>
          <ul>{files?.map((f) => <li key={f.id}>{f.filename}</li>)}</ul>
          <p>list of files end</p>
        </div>
        <div>
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
        <CardDescription>{section.content}</CardDescription>
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
      {sections?.map((s) => (
        <UpdateSiteReportSection
          siteId={siteId}
          reportId={reportId}
          section={s}
          key={`UpdateSiteReportSection-${s.id}`}
        />
      ))}
    </div>
  );
}
