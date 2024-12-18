import Image from "next/image";
import { cn } from "@/lib/utils";
import { HaruFile, SiteReportSection } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { LucideChevronsDownUp, LucideChevronsUpDown } from "lucide-react";
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
import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";

async function ReportSectionFiles({ section }: { section: SiteReportSection }) {
  const files = await Actions.listSiteReportSectionFiles(section.id);
  if (!files || files.length == 0) return null;

  return (
    <ul className="bg-muted p-3">
      {files?.map((f: HaruFile, i) => (
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
                  {files?.map((f2) => (
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

export async function ReportSections({
  sections,
}: {
  sections?: SiteReportSection[];
}) {
  return (
    <Card className="overflow-hidden">
      <Collapsible defaultOpen={true}>
        <CardHeader className="flex flex-row justify-between items-center bg-green-100 hover:bg-green-200 py-0">
          <CardTitle className="text-lg py-6">Report Detail Sections</CardTitle>
          <div>
            <CollapsibleTrigger asChild className="data-[state=closed]:hidden">
              <Button variant="outline">
                Collapse <LucideChevronsDownUp />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleTrigger asChild className="data-[state=open]:hidden">
              <Button variant="outline">
                Expand <LucideChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="flex flex-col p-0">
            <ol className="flex flex-col">
              {sections && sections.length > 0 ? (
                sections.map((section) => {
                  return (
                    <Fragment key={section.id}>
                      <Separator />
                      <li
                        key={section.id}
                        className="py-8 px-12 space-y-4 hover:bg-muted"
                      >
                        <h3 className="text-xl font-semibold underline">
                          {section.title}
                        </h3>
                        <div className="space-y-4">
                          <p className="text-base text-pretty whitespace-pre-line">
                            {section.content}
                          </p>
                          <ReportSectionFiles section={section} />
                        </div>
                      </li>
                    </Fragment>
                  );
                })
              ) : (
                <li className="py-8 px-12 space-y-4 hover:bg-muted">
                  <p className="text-base text-pretty whitespace-pre-line">
                    No detailed sections in this report.
                  </p>
                </li>
              )}
            </ol>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
