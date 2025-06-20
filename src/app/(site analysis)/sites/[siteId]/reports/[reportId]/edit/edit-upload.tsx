"use client";

import { useState, ChangeEvent } from "react";
import useSWR from "swr";
import { HaruFile } from "@/lib/types";
import { uploadReportFile } from "@/lib/utils/upload";
import * as Actions from "@/lib/actions";

import { LucideLoader2, LucidePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileListTable } from "@/components/file-list-table";

export function EditReportFiles({ reportId }: { reportId: number }) {
  const { data: files, mutate } = useSWR<HaruFile[]>(
    `/api/report/${reportId}/files`,
    async () => {
      const files = await Actions.listReportFiles(reportId);
      return files || [];
    },
  );
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(targetFiles)) {
        await uploadReportFile(reportId, file);
        mutate();
      }
      e.target.value = "";
      toast({ description: "Files uploaded successfully" });
    } catch (e) {
      toast({ description: `Upload Error: ${e}` });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleFileDelete(file: HaruFile) {
    try {
      await Actions.deleteSiteReportFile({ reportId, fileId: file.id });
      await mutate();
      toast({ description: `File deleted successfully: ${file.filename}` });
    } catch (e) {
      toast({ description: `Delete Error: ${e}` });
    }
  }

  return (
    <Card className="bg-background p-4">
      <CardContent className="flex flex-col gap-8 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h3 className="font-bold capitalize text-lg">
              Images and Videos
            </h3>
            <Button asChild variant="secondary">
              <Label
                htmlFor={`upload-report-file`}
                className="hover:cursor-pointer"
              >
                <span>Upload Images and Videos</span>
                {isUploading ? (
                  <LucideLoader2 className="animate-spin h-5 w-5" />
                ) : (
                  <LucidePlus className="w-4 h-4" />
                )}
              </Label>
            </Button>
            <Input
              type="file"
              id={`upload-report-file`}
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
              multiple
            />
          </div>
          <FileListTable files={files} handleFileDelete={handleFileDelete} />
        </div>
      </CardContent>
    </Card>
  );
}
