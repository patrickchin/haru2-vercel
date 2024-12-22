"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HaruFile } from "@/lib/types";

import { LucideCheck, LucideMaximize, LucideMinimize } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type FilterTypes = "video" | "image";

function FileImageVideoToggle({
  filter,
  setFilter,
}: {
  filter: FilterTypes;
  setFilter: (f: FilterTypes) => void;
}) {
  return (
    <Tabs
      defaultValue={filter}
      onValueChange={(v) => setFilter(v as FilterTypes)}
    >
      <TabsList className="bg-primary text-primary-foreground rounded-lg h-fit">
        <TabsTrigger value="video" className="rounded p-2 gap-2 pr-3">
          <LucideCheck
            className={cn(
              "transition-all",
              filter === "video" ? "size-4" : "size-0",
            )}
          />
          Videos
        </TabsTrigger>
        <TabsTrigger value="image" className="rounded p-2 gap-2 pr-3">
          <LucideCheck
            className={cn(
              "transition-all",
              filter === "image" ? "size-4" : "size-0",
            )}
          />
          Images
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function FileDisplayCarouselItems({
  files,
  filter,
  hideExpand,
}: {
  files?: HaruFile[];
  filter: FilterTypes;
  hideExpand?: boolean;
}) {
  if (!files || files.length < 1)
    return (
      <CarouselItem className="grid grid-cols-1 items-center justify-center text-center">
        This report has no overview {filter}s.
      </CarouselItem>
    );

  return files.map((f, i) => (
    <CarouselItem key={f.id} className="relative">
      {f.type?.startsWith("image/") && (
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
      {f.type?.startsWith("video/") && (
        <video
          controls
          className="bg-zinc-800 aspect-video"
          preload="metadata"
        >
          <source src={f.url || ""} type={f.type || ""} />
        </video>
      )}
    </CarouselItem>
  ));
}

export function FileDisplayDialogCarouselClient({
  className,
  fileList,
}: {
  className?: string;
  fileList?: HaruFile[];
}) {
  const videoFiles = useMemo(() => {
    return fileList?.filter((f) => f.type?.startsWith("video/"));
  }, [fileList]);
  const imageFiles = useMemo(() => {
    return fileList?.filter((f) => f.type?.startsWith("image/"));
  }, [fileList]);

  const [filter, setFilter] = useState<FilterTypes>(
    videoFiles && videoFiles?.length > 0 ? "video" : "image",
  );

  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  return (
    <div className={cn("w-full mx-auto", "max-w-5xl aspect-video", className)}>
      <div
        ref={dialogDivRef}
        className={cn(
          "grow grid grid-cols-1 h-full",
          "group relative",
          "outline outline-4 rounded",
          "bg-gradient-to-r from-cyan-100 to-blue-100",
          "overflow-hidden"
          // "bg-gradient-to-r from-slate-900 to-slate-950",
        )}
      >
        <Carousel opts={{ watchDrag: false }} className="h-full">
          <CarouselContent className="h-full">
            <FileDisplayCarouselItems
              filter={filter}
              files={filter === "video" ? videoFiles : imageFiles}
              hideExpand={isFullscreen}
            />
          </CarouselContent>
          <CarouselPrevious className="invisible group-hover:visible left-4" />
          <CarouselNext className="invisible group-hover:visible right-4" />
        </Carousel>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute h-8 w-8 rounded-full",
            "top-4 right-4",
            "invisible group-hover:visible",
            filter === "video" ? "hidden" : "",
          )}
          onClick={() => {
            if (isFullscreen) document.exitFullscreen();
            else dialogDivRef.current?.requestFullscreen();
            setIsFullscreen(!isFullscreen);
          }}
        >
          {isFullscreen ? (
            <LucideMinimize className="h-4 w-4" />
          ) : (
            <LucideMaximize className="h-4 w-4" />
          )}
          <span className="sr-only">fullscreen file display</span>
        </Button>
      </div>

      <div className="flex justify-center w-full p-3">
        <FileImageVideoToggle filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
}
