import Image from "next/image";
import { cn } from "@/lib/utils";
import { HaruFile } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { FileDisplay } from "@/components/file-display";
import { SiteReportSection } from "@/lib/types/site";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

async function ReportSectionFiles({ section }: { section: SiteReportSection }) {
  const files = await Actions.getSiteReportSectionFiles(section.id);
  if (!files || files.length == 0) return null;

  return (
    <ul className="bg-muted p-3">
      {files?.map((f: HaruFile, i) => (
        <li
          key={f.id}
          className="inline-block w-[120px] h-[90px] m-1 border rounded overflow-hidden relative hover:opacity-50"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={f.url || ""}
                alt={f.filename || "unknown image"}
                width={200}
                height={150}
                className="object-cover absolute w-full h-full"
              />
            </DialogTrigger>
            <DialogContent
              key="file-viewer-dialog-content"
              className={cn(
                "p-0 bg-transparent max-w-none max-h-none rounded overflow-hidden",
                "w-[100dvw] rounded border-none bg-zinc-800",
              )}
            >
              <DialogTitle className="hidden">Section File Viewer</DialogTitle>
              <Carousel className="w-full h-full" opts={{ startIndex: i }}>
                <CarouselContent>
                  {files?.map((f) => (
                    <CarouselItem
                      key={f.id}
                      className="flex flex-col h-[100dvh]"
                    >
                      {/* TODO why can't i put things here?!?!??!!? */}
                      <FileDisplay file={f} className="grow" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  );
}

export async function ReportSections({
  sections,
}: {
  sections?: SiteReportSection[];
}) {
  return (
    <>
      {sections && sections.length > 0 ? (
        <ol className="flex flex-col gap-4">
          {sections?.map((section) => {
            return (
              <li key={section.id}>
                <Card>
                  <CardHeader className="p-6 pb-3">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <CardDescription className="text-base whitespace-pre-line">
                      {section.content}
                    </CardDescription>
                    <ReportSectionFiles section={section} />
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      ) : (
        <Card className="">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-lg">Report Detail Sections</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-0">
            --
          </CardContent>
        </Card>
      )}
    </>
  );
}
