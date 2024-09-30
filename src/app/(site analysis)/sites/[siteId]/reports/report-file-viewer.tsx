import { cn } from "@/lib/utils";
import Image from "next/image";
import { HaruFile } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideCamera, LucideVideo, LucideFileText } from "lucide-react";
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

function FileDisplayOne({ file }: { file?: HaruFile }) {
  return (
    <div className="flex items-center justify-center relative h-[30rem]">
      {file &&
        file.url &&
        file.url.length > 0 &&
        file.type &&
        (file.type?.startsWith("image/") ? (
          <Image
            src={file.url}
            alt={file.filename || "<Untitled>"}
            fill={true}
            className="object-contain"
          />
        ) : file.type?.startsWith("video/") ? (
          <video controls className="max-w-full max-h-full w-full h-full">
            <source src={file.url} type={file.type} />
          </video>
        ) : (
          <div className="relative w-full h-full overflow-auto p-6">
            <pre className="absolute text-begin overflow-hidden">
              {JSON.stringify(file, undefined, 4)}
            </pre>
          </div>
        ))}
    </div>
  );
}

export function FileDisplay({
  fileList,
  file,
}: {
  fileList?: HaruFile[];
  file?: HaruFile;
}) {
  return (
    <div
      className={cn(
        "grow flex items-center justify-center relative",
        // "overflow-y-scroll",
        "border-4 border-black rounded",
        "bg-gradient-to-r from-cyan-100 to-blue-100",
      )}
    >
      {fileList && fileList.length > 0 ? (
        <Carousel className="w-full h-full">
          <CarouselContent>
            {fileList?.map((f) => (
              <CarouselItem key={f.id}>
                <FileDisplayOne file={f} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="flex m-1 h-[30rem] items-center justify-center align-middle">
          This report has no overview files
        </div>
      )}

      <div>{/* <FileSelector fileList={fileList} file={file} /> */}</div>
    </div>
  );
}

export async function ReportFileDisplay({
  siteId,
  reportId,
  fileId,
}: {
  siteId?: number;
  reportId?: number;
  fileId?: number;
}) {
  if (!reportId) return <FileDisplay />;
  const fileList = await Actions.getFilesForReport(reportId);
  const file = fileList?.find((f) => f.id === fileId);
  return <FileDisplay fileList={fileList} file={file} />;
}
