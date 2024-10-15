"use client";
import { useState, ChangeEvent } from "react";
import useSWR from "swr";
import { HaruFile } from "@/lib/types";
import { uploadReportFile } from "@/lib/utils/upload";
import * as Actions from "@/lib/actions";
import prettyBytes from "pretty-bytes";

import { LucideLoader2, LucideTrash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UploadAndManageFiles({ reportId }: { reportId: number }) {
  const { data: files, mutate } = useSWR<HaruFile[]>(
    `/api/report/${reportId}/files`,
    async () => {
      const files = await Actions.getFilesForReport(reportId);
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
    <Card className="bg-background border-2">
      <CardHeader className="flex flex-row justify-between">
        <h2 className="text-lg font-bold">Report Overview Files</h2>
      </CardHeader>
      {/* File Upload Section */}
      <CardContent className="flex flex-col gap-4 p-4 pt-0">
        <div>
          <Button asChild>
            <label
              htmlFor="upload-report-file"
              className="rounded hover:cursor-pointer"
            >
              Upload Files
              {isUploading && (
                <LucideLoader2 className="animate-spin h-5 w-5" />
              )}
            </label>
          </Button>
          <Input
            type="file"
            id="upload-report-file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
            multiple
          />
        </div>

        <ul className="space-y-2">
          {files?.map((file) => (
            <li
              key={file.id}
              className="flex gap-4 items-center bg-accent px-6 py-1 rounded"
            >
              <span className="grow">{file.filename}</span>
              <span className="">
                {file.filesize && prettyBytes(file.filesize)}
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <LucideTrash2 className="h-4 w-4" />
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
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
