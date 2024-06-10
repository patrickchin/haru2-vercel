"use client";

import { ChangeEvent, useRef, useState } from "react";
import assert from "assert";
import Link from "next/link";
import { getTaskFiles, addTaskFile } from "@/lib/actions";
import { DesignFile } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LucideDownload,
  LucideLoader2,
  LucideUpload,
  LucideView,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileTypeToIcon from "@/components/filetype-icon";
import { cn, uploadProjectFile } from "@/lib/utils";

export default function TaskFilesClient({
  projectId,
  specId,
  taskId,
  files,
}: {
  projectId: number;
  specId: number;
  taskId: number;
  files: DesignFile[];
}) {
  const uploadFileInputRef = useRef(null);
  const [showDetailed, setShowDetailed] = useState(false);
  const [updatedFiles, setUpdatedFiles] = useState(files);
  const [isUploading, setIsUploading] = useState(false);

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;

    setIsUploading(true);

    assert(targetFiles.length >= 1);

    const selectedFiles = Array.from(targetFiles);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      const fileUrl = await uploadProjectFile(file, projectId, specId);
      await addTaskFile(
        taskId,
        file.type,
        file.name,
        file.size,
        fileUrl,
        projectId,
      );
    }

    const files = await getTaskFiles(taskId);
    if (files) setUpdatedFiles(files);

    e.target.value = "";
    setIsUploading(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row gap-4">
        <div className="grow font-bold">Files</div>
        <Input
          type="file"
          id="uploadfile"
          className="hidden"
          ref={uploadFileInputRef}
          onChange={onChangeUploadFile}
          disabled={isUploading}
          multiple
        />
        <Button
          asChild
          type="button"
          variant="secondary"
          disabled={isUploading}
        >
          <Label
            htmlFor="uploadfile"
            className={cn(
              "space-x-4",
              isUploading ? "cursor-progress" : "cursor-pointer",
            )}
          >
            {isUploading ? (
              <>
                <LucideLoader2 className="animate-spin h-4" /> Uploading{" "}
              </>
            ) : (
              <>
                <LucideUpload className="h-4" /> Upload{" "}
              </>
            )}
          </Label>
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowDetailed(!showDetailed)}
        >
          {showDetailed ? "Hide File Details" : "Expand File Details"}
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3 text-sm">
        {updatedFiles.map((f, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-2 px-3 border rounded-lg",
              showDetailed ? "py-4" : "py-2",
            )}
          >
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <FileTypeToIcon type={f.type || ""} className="h-8 flex-none" />
                <div className="text-ellipsis font-bold text-base overflow-hidden">
                  {f.filename}
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center gap-0",
                  showDetailed ? "hidden" : "",
                )}
              >
                <Button variant="ghost" className="p-1 cursor-not-allowed">
                  <LucideView className="h-4" />
                </Button>
                <Button asChild variant="ghost" className="p-1">
                  <Link href={f.url || "#"} target="_blank">
                    <LucideDownload className="h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {showDetailed && (
              <div className="flex flex-col gap-1">
                {/* <pre className="overflow-hidden">{f.type}</pre> */}
                <Button
                  variant="ghost"
                  className="flex gap-2 justify-start cursor-not-allowed"
                >
                  <LucideView className="h-4" />
                  View In Browser
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="flex gap-2 justify-start"
                >
                  <Link href={f.url || "#"} target="_blank">
                    <LucideDownload className="h-4" />
                    Download Latest
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex gap-2 justify-start cursor-not-allowed"
                >
                  <LucideUpload className="h-4" />
                  Upload New Version
                </Button>
                <ScrollArea className="h-36 border rounded-sm p-2 cursor-not-allowed">
                  {Array.from(Array(8)).map((_, i) => (
                    <div
                      key={i}
                      className="border-b p-2 flex justify-between hover:bg-accent"
                    >
                      <span>Version {8 - i}</span>
                      <span>
                        {new Date(
                          Date.now() - i * 5 * 24 * 3600 * 1000,
                        ).toDateString()}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
