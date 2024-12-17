"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HaruFile } from "@/lib/types";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LucideVideo,
  LucideFileText,
  LucideMaximize2,
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
import {
  DisplayImage360,
  Image360,
  Image360Toggle,
} from "@/components/display-image-360";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

function DialogTrigger2({ className }: { className?: string }) {
  return (
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute h-8 w-8 rounded-full",
          "top-4 right-4",
          className,
        )}
      >
        <LucideMaximize2 className="h-4 w-4" />
        <span className="sr-only">Open Dialog</span>
      </Button>
    </DialogTrigger>
  );
}

function FileDisplayCarouselItems({
  files,
  type,
}: {
  files?: HaruFile[];
  type: "image" | "video";
}) {
  if (!files || files.length < 1)
    return (
      <CarouselItem className="grid grid-cols-1 items-center justify-center text-center">
        This report has no overview images.
      </CarouselItem>
    );

  return files.map((f, i) => (
    <CarouselItem key={f.id} className="relative">
      <Dialog>
        {type === "image" && (
          <DisplayImage360>
            <Image360
              src={f.url || ""}
              alt={f.filename || "invalid image src"}
              fill={true}
              unoptimized={true}
              className="object-contain"
            />
            <Image360Toggle className="mr-10 invisible group-hover:visible" />
          </DisplayImage360>
        )}
        {type === "video" && (
          <video
            controls
            className="max-w-full max-h-full w-full h-full bg-zinc-800"
            preload="metadata"
          >
            <source src={f.url || ""} type={f.type || ""} />
          </video>
        )}
        <DialogTrigger2 className="invisible group-hover:visible" />

        <DialogContent
          className={cn(
            "p-0 max-w-none max-h-none overflow-hidden",
            "border-none bg-zinc-700",
          )}
        >
          <DialogTitle className="hidden">Section File Viewer</DialogTitle>
          <Carousel
            className="group"
            opts={{ startIndex: i, watchDrag: false }}
          >
            <CarouselContent>
              {files?.map((f2) => (
                <CarouselItem key={f2.id}>
                  <div className="relative w-full h-svh flex flex-row">
                    {type === "image" && (
                      <DisplayImage360>
                        <Image360
                          src={f2.url || ""}
                          alt={f2.filename || "invalid image src"}
                          fill={true}
                          unoptimized={true}
                          className="object-contain"
                        />
                        <Image360Toggle className="mr-10 invisible group-hover:visible" />
                      </DisplayImage360>
                    )}
                    {type === "video" && (
                      <video
                        controls
                        className="h-full w-full"
                        preload="metadata"
                      >
                        <source src={f2.url || ""} type={f2.type || ""} />
                      </video>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 invisible group-hover:visible" />
            <CarouselNext className="right-4 invisible group-hover:visible" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </CarouselItem>
  ));
}

export function FileDisplayCarousel({
  className,
  fileList,
  file,
}: {
  className?: string;
  fileList?: HaruFile[];
  file?: HaruFile;
}) {
  const videoFiles = useMemo(() => {
    return fileList?.filter((f) => f.type?.startsWith("video/"));
  }, [fileList]);
  const imageFiles = useMemo(() => {
    return fileList?.filter((f) => !f.type?.startsWith("video/"));
  }, [fileList]);

  const [videosView, setVideosView] = useState(
    videoFiles && videoFiles?.length > 0,
  );

  return (
    <div className={cn("w-full mx-auto", "max-w-5xl aspect-video", className)}>
      <Carousel
        className={cn(
          "grow grid grid-cols-1 h-full",
          "group",
          "outline outline-4 rounded",
          "bg-gradient-to-r from-cyan-100 to-blue-100",
          // "bg-gradient-to-r from-slate-900 to-slate-950",
        )}
        opts={{ watchDrag: false }}
      >
        <CarouselContent className="h-full carouselcontent">
          <FileDisplayCarouselItems
            type={videosView ? "video" : "image"}
            files={videosView ? videoFiles : imageFiles}
          />
        </CarouselContent>
        <CarouselPrevious className="invisible group-hover:visible left-4" />
        <CarouselNext className="invisible group-hover:visible right-4" />
      </Carousel>

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
