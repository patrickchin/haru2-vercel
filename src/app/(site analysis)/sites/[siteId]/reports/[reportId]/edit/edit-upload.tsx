"use client";

import { useState, ChangeEvent, useMemo } from "react";
import Image from "next/image";
import useSWR, { KeyedMutator } from "swr";
import { HaruFile } from "@/lib/types";
import { uploadReportFile } from "@/lib/utils/upload";
import * as Actions from "@/lib/actions";
import prettyBytes from "pretty-bytes";

import {
  LucideLoader2,
  LucidePlus,
  LucideTrash2,
  LucideVideo,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <label
            htmlFor={`upload-report-file-${type}`}
            className="rounded hover:cursor-pointer flex gap-2"
          >
            <span className="capitalize">Upload {type}</span>
            {isUploading ? (
              <LucideLoader2 className="animate-spin h-5 w-5" />
            ) : (
              <LucidePlus className="w-4 h-4" />
            )}
          </label>
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
                              fill={true}
                              // width={38}
                              // height={38}
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
    </div>
  );
}

export function UploadAndManageFiles({ reportId }: { reportId: number }) {
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
    <Card className="bg-background border-2 p-4">
      {/* <CardHeader className="flex flex-row justify-between pb-0">
        <h2 className="text-lg font-bold">Report Overview Files</h2>
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
