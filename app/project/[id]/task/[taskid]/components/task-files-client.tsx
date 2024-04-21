"use client";

import { ChangeEvent, useRef, useState } from "react";
import assert from "assert";
import Link from "next/link";
import { addTaskFile } from "@/lib/actions";
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
import { LucideDownload, LucideUpload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileTypeToIcon from "@/components/filetype-icon";

export default function TaskFilesClient({
  taskId,
  files,
}: {
  taskId: number;
  files: DesignFile[];
}) {
  const uploadFileInputRef = useRef(null);
  const [showDetailed, setShowDetailed] = useState(false);
  const [updatedFiles, setUpdatedFiles] = useState(files);

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;

    assert(targetFiles.length == 1);
    const file = targetFiles.item(0);
    assert(file);

    // server action arguments can only be primatives or FormData
    const data = new FormData();
    data.set("file", file);
    const newFiles = await addTaskFile(taskId, data);
    if (newFiles) setUpdatedFiles(newFiles);
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
        />
        <Button asChild type="button" variant="secondary">
          <Label htmlFor="uploadfile" className="space-x-4 cursor-pointer">
            <LucideUpload className="h-4" />
            Upload New
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
            className="flex flex-col gap-2 py-4 px-3 border rounded-lg"
          >
            <div className="flex flex-nowrap gap-2 items-center justify-start px-2">
              <FileTypeToIcon type={f.type || ""} className="h-8 flex-none" />
              <div className="text-ellipsis font-bold text-base overflow-hidden">
                {f.filename}
              </div>
            </div>
            {showDetailed && (
              <div className="flex flex-col gap-1">
                {/* <Button variant="ghost" className="flex gap-2 justify-start">
                  <LucideView className="h-4" />
                  View In Browser
                </Button> */}
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
                          Date.now() - i * 5 * 24 * 3600 * 1000
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