"use client";
import { useState, ChangeEvent } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import { HaruFile } from "@/lib/types";
import { uploadReportFile } from "@/lib/utils/upload";
import * as Actions from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { LucideLoader2, LucideTrash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadAndManageFiles({ reportId }: { reportId: number }) {
  const { data: files, mutate } = useSWR<HaruFile[]>(
    `/api/report/${reportId}/files`,
    async () => {
      const files = await Actions.getFilesForReport(reportId);
      return files || [];
    },
  );

  const [isUploading, setIsUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<HaruFile | null>(null);

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
      // await deleteReportFile(file.id); // API for deleting file
      mutate(); // Refresh the file list after deletion
      setFileToDelete(null);
      toast({ description: "File deleted successfully" });
    } catch (e) {
      toast({ description: `Delete Error: ${e}` });
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="w-full">
        <Button asChild>
          <label
            htmlFor="upload-report-file"
            className="w-full bg-black text-white py-3 px-4 rounded-lg text-center flex items-center justify-center"
          >
            {isUploading ? (
              <LucideLoader2 className="animate-spin h-5 w-5" />
            ) : (
              "Upload Files"
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

      <ul className="space-y-3">
        {files?.map((file) => (
          <li
            key={file.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
          >
            <span className="font-medium text-gray-800">{file.filename}</span>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-gray-500 hover:text-red-500">
                  <LucideTrash2 className="h-5 w-5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete File</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{file.filename}</strong>?
                </DialogDescription>
                <div className="flex space-x-4 mt-4">
                  <Button
                    onClick={() => handleFileDelete(file)}
                    className="bg-red-500 text-white"
                  >
                    Confirm
                  </Button>
                  <DialogClose asChild>
                    <Button className="bg-gray-500 text-white">Cancel</Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ul>
    </div>
  );
}
