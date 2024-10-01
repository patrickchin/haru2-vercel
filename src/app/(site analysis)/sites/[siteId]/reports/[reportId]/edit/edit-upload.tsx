"use client";

import { useState, ChangeEvent } from "react";
import useSWR from "swr";
import { HaruFile } from "@/lib/types";
import { uploadReportFile } from "@/lib/utils/upload";
import * as Actions from "@/lib/actions";

import { LucideLoader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UpdateSiteReportFiles({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const { data: files, mutate } = useSWR<HaruFile[]>(
    `/api/report/${reportId}/files`, // api route doesn't really exist
    async () => {
      const files = await Actions.getFilesForReport(reportId);
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
        const f = await uploadReportFile(reportId, file);
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
    <Card className="">
      <CardHeader>
        <CardTitle>Report Overview Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <ul>{files?.map((f) => <li key={f.id}>{f.filename}</li>)}</ul>
        </div>
        <div>
          <Button asChild>
            <Label
              htmlFor="upload-report-file"
              // className="flex w-full h-full"
            >
              Add File to Report Overview
              <Input
                type="file"
                id="upload-report-file"
                className="hidden"
                onChange={onChangeUploadFile}
                disabled={isUploading}
                multiple
              />
              {isUploading && <LucideLoader2 className="animate-spin h-4" />}
            </Label>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
