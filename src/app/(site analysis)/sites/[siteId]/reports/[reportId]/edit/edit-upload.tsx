"use client";

import { useState, ChangeEvent, useMemo } from "react";
import useSWR, { KeyedMutator } from "swr";
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

function UploadAndManageFilesSection({
  reportId,
  files,
  mutate,
  type,
}: {
  reportId: number;
  files?: HaruFile[];
  mutate: KeyedMutator<HaruFile[]>;
  type: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(targetFiles)) {
        await uploadReportFile(reportId, file);
        mutate(); // Refresh files after upload
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
      await mutate(); // Refresh the file list after deletion
      toast({ description: `File deleted successfully: ${file.filename}` });
    } catch (e) {
      toast({ description: `Delete Error: ${e}` });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h3 className="font-bold capitalize text-lg">
          Report Overview {type}s
        </h3>
        <Button asChild variant="default">
          <Label
            htmlFor={`upload-report-file-${type}`}
            className="rounded hover:cursor-pointer flex gap-2"
          >
            <span className="capitalize">Upload {type}</span>
            {isUploading ? (
              <LucideLoader2 className="animate-spin h-5 w-5" />
            ) : (
              <LucidePlus className="w-4 h-4" />
            )}
          </Label>
        </Button>
        <Input
          type="file"
          id={`upload-report-file-${type}`}
          accept={`${type}/*`}
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
          multiple
        />
      </div>

      <FileListTable
        files={files}
        handleFileDelete={handleFileDelete}
        type={type}
      />
    </div>
  );
}

export function EditReportFiles({ reportId }: { reportId: number }) {
  const { data: files, mutate } = useSWR<HaruFile[]>(
    `/api/report/${reportId}/files`,
    async () => {
      const files = await Actions.listReportFiles(reportId);
      return files || [];
    },
  );

  const images = useMemo(() => {
    return files?.filter((f) => {
      return f.type?.startsWith("image/");
    });
  }, [files]);
  const videos = useMemo(() => {
    return files?.filter((f) => {
      return f.type?.startsWith("video/");
    });
  }, [files]);

  return (
    <Card className="bg-background p-4">
      {/* <CardHeader className="flex flex-row justify-between pb-0">
        <CardTitle className="text-lg font-bold">Report Overview Files</CardTitle>
      </CardHeader> */}
      {/* <CardContent className="grid grid-cols-4 gap-4 p-4"> */}
      <CardContent className="flex flex-col gap-8 p-4">
        <UploadAndManageFilesSection
          type="video"
          reportId={reportId}
          files={videos}
          mutate={mutate}
        />
        <UploadAndManageFilesSection
          type="image"
          reportId={reportId}
          files={images}
          mutate={mutate}
        />
      </CardContent>
    </Card>
  );
}
