"use client";

import { cn } from "@/lib/utils";
import { HaruFile } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { FileDisplay } from "@/components/file-display";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LucideCamera,
  LucideVideo,
  LucideFileText,
  LucideExpand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { set } from "date-fns";

export function FileSelector({
  fileList,
  file,
}: {
  fileList?: HaruFile[];
  file?: HaruFile;
}) {
  const filters = [
    { label: "All", mime: "" },
    { label: "Pictures", mime: "image" },
    { label: "Videos", mime: "video" },
  ];

  const filteredFiles = fileList?.filter((f) => {
    return f.type?.startsWith("");
  });

  return (
    <div className="flex-none flex flex-col gap-3">
      {/* <div className="grid gap-2 w-44 px-1">
        <ul className="flex flex-col gap-2">
          {filters.map((f, i) => (
            <li key={i} className="bg-background cursor-pointer">
              <Button
                className={cn("w-full", f.mime == mimeFilter ? "outline" : "")}
                variant="outline"
                disabled={f.mime == mimeFilter}
                onClick={() => {
                  setMimeFilter(f.mime);
                }}
              >
                {f.label}
              </Button>
            </li>
          ))}
        </ul>
      </div> */}

      <ScrollArea>
        <ul className="flex flex-col gap-1 p-1 w-44">
          {filteredFiles?.map((r, i) => (
            <li key={i}>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      // onClick={() => setSelectedFile(r)}
                      className={cn(
                        "gap-2 px-3 w-full justify-start",
                        r.id === file?.id ? "outline" : "",
                      )}
                      // disabled={r.id === selectedFile?.id}
                    >
                      <div>
                        {r.type?.startsWith("image/") ? (
                          <LucideCamera className="w-4" />
                        ) : r.type?.startsWith("video/") ? (
                          <LucideVideo className="w-4" />
                        ) : (
                          <LucideFileText className="w-4" />
                        )}
                      </div>

                      <p className="text-nowrap overflow-hidden text-ellipsis">
                        {r.filename}
                      </p>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">{r.filename}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

export function FileDisplayCarousel({
  fileList,
  file,
}: {
  fileList?: HaruFile[];
  file?: HaruFile;
}) {
  const [largeView, setLargeView] = useState(false);

  return (
    <div
      className={cn(
        "w-full mx-auto",
        largeView ? "w-[90dw] max-w-[100rem]" : "max-w-5xl",
      )}
    >
      <div
        className={cn(
          "grow flex flex-col items-center justify-center relative",
          "border-4 border-black rounded",
          "bg-gradient-to-r from-cyan-100 to-blue-100",
        )}
      >
        {fileList && fileList.length > 0 ? (
          <Carousel className="w-full h-full group" opts={{ watchDrag: false }}>
            <CarouselContent>
              {fileList?.map((f) => (
                <CarouselItem key={f.id} className="">
                  <FileDisplay
                    file={f}
                    allow3d={true}
                    className={cn(largeView ? "h-[45rem]" : "h-[30rem]")}
                    controlsClassName="invisible group-hover:visible"
                  >
                    <Button
                      className="rounded-full w-8 h-8"
                      variant="outline"
                      size="icon"
                      onClick={() => setLargeView((w) => !w)}
                    >
                      <LucideExpand className="w-4 h-4" />
                    </Button>
                  </FileDisplay>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="invisible group-hover:visible left-4" />
            <CarouselNext className="invisible group-hover:visible right-4" />
          </Carousel>
        ) : (
          <div className="flex h-[30rem] items-center justify-center align-middle">
            This report has no overview files
          </div>
        )}

        {/* <FileSelector fileList={fileList} file={file} /> */}
      </div>
    </div>
  );
}
