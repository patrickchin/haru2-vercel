import { Fragment, Suspense } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HaruFile, SiteReportSection } from "@/lib/types";
import * as Actions from "@/lib/actions";

import {
  LucideChevronsDownUp,
  LucideChevronsUpDown,
  LucideLoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

function ReportSectionImageFiles({ files }: { files: HaruFile[] }) {
  const imageFiles = files.filter((f: HaruFile) =>
    f.type?.startsWith("image/"),
  );

  if (imageFiles.length === 0) return null;

  return (
    <ul className="bg-muted p-3">
      {imageFiles.map((f: HaruFile, i) => (
        <li
          key={f.id}
          className="inline-block w-[120px] h-[90px] m-1 border rounded overflow-hidden relative hover:opacity-50 bg-background"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={f.url || ""}
                alt={f.filename || "unknown image"}
                width={128}
                height={128}
                className="object-cover absolute h-full w-full"
              />
            </DialogTrigger>
            <DialogContent
              className={cn(
                "p-0 max-w-none max-h-none overflow-hidden",
                "w-full h-full border-none bg-zinc-700",
              )}
            >
              <DialogTitle className="hidden">Section File Viewer</DialogTitle>
              <Carousel className="w-full h-full" opts={{ startIndex: i }}>
                <CarouselContent>
                  {imageFiles.map((f2) => (
                    <CarouselItem key={f2.id}>
                      <div className="relative h-svh">
                        <Image
                          src={f2.url || ""}
                          alt={f2.filename || "unknown image"}
                          fill={true}
                          className="object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              <DialogClose />
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  );
}

function ReportSectionAudioFiles({ files }: { files: HaruFile[] }) {
  const audioFiles = files.filter((f: HaruFile) =>
    f.type?.startsWith("audio/"),
  );
  if (audioFiles.length === 0) return null;

  return (
    <div className="overflow-x-auto border bg-background">
      <Table>
        <TableBody>
          {audioFiles.map((f, i) => (
            <TableRow key={f.id} className="border-t first:border-t-0">
              <TableCell className="w-1 pl-3 align-middle">{i + 1}</TableCell>
              <TableCell className="w-1 pr-3 align-middle">
                <audio controls src={f.url || ""} />
              </TableCell>
              <TableCell className="whitespace-nowrap align-middle">
                {f.filename}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

async function ReportSectionItem({ section }: { section: SiteReportSection }) {
  const files = (await Actions.listSiteReportSectionFiles(section.id)) || [];

  return (
    <li className="py-8 px-12 space-y-4 hover:bg-muted">
      <h3 className="text-xl font-semibold underline">{section.title}</h3>
      <div className="space-y-4">
        <p className="text-base text-pretty whitespace-pre-line">
          {section.content}
        </p>
        <>
          <ReportSectionAudioFiles files={files} />
          <ReportSectionImageFiles files={files} />
        </>
      </div>
    </li>
  );
}

async function ReportSectionList({ reportId }: { reportId: number }) {
  const sections = await Actions.listSiteReportSections(reportId);

  return (
    <ol className="flex flex-col">
      {sections && sections.length > 0 ? (
        await Promise.all(
          sections.map(async (section) => (
            <Fragment key={section.id}>
              <Separator />
              <ReportSectionItem section={section} />
            </Fragment>
          )),
        )
      ) : (
        <li className="p-6 text-center text-sm text-muted-foreground bg-green-100 dark:bg-green-950 ">
          No detailed sections in this report.
        </li>
      )}
    </ol>
  );
}

export async function ReportSections({ reportId }: { reportId: number }) {
  return (
    <Card className="overflow-hidden">
      <Collapsible defaultOpen={true}>
        <CardHeader className="flex flex-row justify-between items-center bg-green-100 dark:bg-green-950 py-0">
          <CardTitle className="text-lg py-6">Report Detail Sections</CardTitle>
          <div>
            <Button variant="outline" asChild>
              <CollapsibleTrigger className="first:*:data-[state=closed]:hidden last:*:data-[state=open]:hidden">
                <div className="flex gap-1 items-center">
                  Collapse <LucideChevronsDownUp />
                </div>
                <div className="flex gap-1 items-center">
                  Expand <LucideChevronsUpDown />
                </div>
              </CollapsibleTrigger>
            </Button>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="flex flex-col p-0">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-6">
                  <LucideLoaderCircle className="animate-spin" />
                </div>
              }
            >
              <ReportSectionList reportId={reportId} />
            </Suspense>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
