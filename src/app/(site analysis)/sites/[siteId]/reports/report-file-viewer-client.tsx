"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HaruFile } from "@/lib/types";

import { FileDisplay } from "@/components/file-display";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LucideCamera,
  LucideVideo,
  LucideFileText,
  LucideMaximize2,
  LucideMinimize2,
  LucideCheck,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FileSelector({
  files,
  file,
}: {
  files?: HaruFile[];
  file?: HaruFile;
}) {
  const filters = [
    { label: "All", mime: "" },
    { label: "Pictures", mime: "image" },
    { label: "Videos", mime: "video" },
  ];

  const filteredFiles = files?.filter((f) => {
    return f.type?.startsWith("");
  });

  return (
    <div className="flex-none flex flex-col gap-3 border">
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
        <ul className="flex gap-1 p-3">
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
                      <div className="w-10 h-10 relative">
                        {r.type?.startsWith("image/") ? (
                          // this doesn't work?
                          <Image
                            src={r.url || ""}
                            alt={r.filename || ""}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : // <LucideCamera className="w-4" />
                        r.type?.startsWith("video/") ? (
                          <LucideVideo className="w-4" />
                        ) : (
                          <LucideFileText className="w-4" />
                        )}
                      </div>

                      {/* <p className="text-nowrap overflow-hidden text-ellipsis">
                        {r.filename}
                      </p> */}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{r.filename}</TooltipContent>
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

  const videoFiles = useMemo(() => {
    return fileList?.filter((f) => f.type?.startsWith("video/"));
  }, [fileList]);
  const imageFiles = useMemo(() => {
    return fileList?.filter((f) => !f.type?.startsWith("video/"));
  }, [fileList]);

  const [largeView, setLargeView] = useState(false);
  const [videosView, setVideosView] = useState(videoFiles && videoFiles?.length > 0);

  const files = videosView ? videoFiles : imageFiles;

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
        {files && files.length > 0 ? (
          <Carousel className="w-full h-full group" opts={{ watchDrag: false }}>
            <CarouselContent>
              {files?.map((f) => (
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
                      {largeView ? (
                        <LucideMinimize2 className="w-4 h-4 rotate-90" />
                      ) : (
                        <LucideMaximize2 className="w-4 h-4 rotate-90" />
                      )}
                    </Button>
                  </FileDisplay>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="invisible group-hover:visible left-4" />
            <CarouselNext className="invisible group-hover:visible right-4" />
          </Carousel>
        ) : (
          <div
            className={cn(
              "flex items-center justify-center align-middle",
              largeView ? "h-[45rem]" : "h-[30rem]",
            )}
          >
            This report has no overview {videosView ? "videos" : "images"}
          </div>
        )}
      </div>
      {/* <FileSelector fileList={files} file={file} /> */}

      <div className="flex justify-center w-full p-3">
        <Tabs
          defaultValue={videosView ? "video" : "image"}
          onValueChange={(v) => setVideosView(v === "video")}
        >
          <TabsList className="bg-primary text-primary-foreground rounded h-fit">
            <TabsTrigger value="video" className="rounded p-2 gap-2 pr-3">
              {videosView && <LucideCheck className="w-4 h-4" />}
              Videos
            </TabsTrigger>
            <TabsTrigger value="image" className="rounded p-2 gap-2 pr-3">
              {!videosView && <LucideCheck className="w-4 h-4" />}
              Images
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
