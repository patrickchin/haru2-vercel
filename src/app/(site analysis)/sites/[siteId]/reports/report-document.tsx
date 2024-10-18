import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { HaruFile } from "@/lib/types";
import * as Actions from "@/lib/actions";

import {
  LucideChevronDown,
  LucideChevronRight,
  LucideMoveLeft,
} from "lucide-react";
import { FileDisplay } from "@/components/file-display";
import { Button } from "@/components/ui/button";
import {
  SiteDetails,
  SiteReport,
  SiteReportAll,
  SiteReportSection,
} from "@/lib/types/site";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ReportsViewerProps {
  siteId: number;
  reportId: number;
  fileId: number;
}

export async function ReportListPopup({
  site,
  report,
}: {
  site?: SiteDetails;
  report?: SiteReport;
}) {
  if (!site) return <div>invalid site</div>;

  const reports = await Actions.getSiteReports(site.id);
  const noReports = <div>No reports</div>;
  if (!reports) return noReports;
  if (reports.length < 1) return noReports;

  return (
    <ScrollArea className="flex flex-col max-h-[60svh] p-0">
      <ol>
        {reports.map((r) => (
          <li key={r.id} className="w-full">
            <Button variant="link" asChild className="w-full px-8 py-5">
              <Link
                href={`/sites/${site.id}/reports/${r.id}`}
                className={cn(
                  "flex justify-between gap-4 w-full text-xl",
                  report && report.id === r.id
                    ? "pointer-events-none opacity-50"
                    : "",
                )}
              >
                <span>
                  {`Site Report #${r.id} - ${r.createdAt?.toDateString() || "unknown date"}`}
                </span>
                <LucideChevronRight className="" />
              </Link>
            </Button>
          </li>
        ))}
      </ol>
    </ScrollArea>
  );
}

export async function ReportTitleBarDisplay({
  session,
  site,
  report,
}: {
  session?: Session | null;
  site?: SiteDetails;
  report?: SiteReport;
}) {
  const memberRole = site ? await Actions.getSiteRole(site.id) : "";
  return (
    <div className="grow flex flex-col sm:flex-row gap-3">
      <div>
        <Button variant="secondary" asChild>
          <Link
            href={`/sites/${site?.id ?? ""}`}
            className="flex gap-2 w-full h-full items-center"
          >
            <LucideMoveLeft />
            Back to Project
          </Link>
        </Button>
      </div>

      <div className="grow flex w-full sm:w-fit">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className="items-center gap-4 border-2 rounded border-primary"
            >
              <h1 className="text-xl sm:text-2xl font-semibold grow text-center">
                {report
                  ? `Site Report #${report.id} - ${report.createdAt?.toDateString()}`
                  : "Click here to select a report"}
              </h1>
              <LucideChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="px-0 py-4 w-full rounded border-2 border-primary shadow-xl"
            align="center"
            side="bottom"
            sideOffset={12}
            sticky="always"
            avoidCollisions={false}
          >
            <ReportListPopup site={site} report={report} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="">
        {site &&
          session &&
          session.user &&
          memberRole &&
          ["supervisor", "owner", "manager"].includes(memberRole) && (
            <div className="grid grid-cols-2 w-full sm:w-fit sm:flex gap-4">
              {report && (
                <Button variant="secondary" asChild>
                  <Link href={`/sites/${site.id}/reports/${report.id}/edit`}>
                    Edit Report
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link href={`/sites/${site.id}/reports/new`}>New Report</Link>
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}

export async function ReportTitleBar({ siteId, reportId }: ReportsViewerProps) {
  const session = await auth();
  const [site, report] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.getSiteReport(reportId),
  ]);
  const props = { session, site, report };
  return <ReportTitleBarDisplay {...props} />;
}

export async function ReportTitleBarNull() {
  return <ReportTitleBarDisplay />;
}

export async function ReportSection({
  section,
}: {
  section: SiteReportSection;
}) {
  const files = await Actions.getSiteReportSectionFiles(section.id);
  return (
    <Card>
      <CardHeader className="p-4 pb-3 font-bold text-lg">
        {section.title}
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <CardDescription className="text-base">
          {section.content}
        </CardDescription>
        {section.fileGroupId && (
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
                    <Carousel
                      className="w-full h-full"
                      opts={{ startIndex: i }}
                    >
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
        )}
      </CardContent>
    </Card>
  );
}

export async function ReportDocumentDisplay({
  site,
  report,
  sections,
}: {
  site?: SiteDetails;
  report?: SiteReportAll;
  sections?: SiteReportSection[];
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        site && report ? "" : "brightness-95",
      )}
    >
      <Card className="border-2">
        <CardHeader className="flex flex-row justify-between">
          <div className="text-lg font-bold">Site Project Details</div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 pt-0">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Project Id</TableHead>
                <TableCell>{report?.siteId ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Site Address</TableHead>
                <TableCell>{report?.address ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Visit Date</TableHead>
                <TableCell>
                  {report?.visitDate?.toDateString() ?? "--"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableCell>{report?.ownerName ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableCell>{report?.contractorName ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Supervisor</TableHead>
                <TableCell>{report?.supervisorName ?? "--"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-2 hidden">
        <CardHeader className="flex flex-row justify-between">
          <div className="text-lg font-bold">
            Current Budget and Timeline Estimates
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4 p-4 pt-0">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Construction Budget</TableHead>
                <TableCell>{report?.budget ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Budget Spent</TableHead>
                <TableCell>{report?.spent ?? "--"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Construction Timeline</TableHead>
                <TableCell>{report?.timeline ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Completion Date</TableHead>
                <TableCell>
                  {report?.completion?.toDateString() ?? "--"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-cyan-50 border-2">
        <CardHeader className="flex flex-row justify-between">
          <div className="text-lg font-bold">
            Current Construction Activites
          </div>
        </CardHeader>

        {/* <CardContent className="flex flex-col gap-3 p-4 pt-0"> */}
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-0">
          {/* <CardContent className="flex p-3 pt-0"> */}

          <div className="flex flex-col gap-3">
            <div className="p-3 bg-background space-y-2 rounded border">
              <h2 className="text-base font-semibold">Site Activity</h2>

              <Table>
                <TableBody>
                  {report?.activity?.split("\n").map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="whitespace-pre-line">
                        <p>{a ?? "--"}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center p-3 bg-background rounded border">
              <h2 className="text-base font-semibold">Materials Status</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Open
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-h-96 max-h-svh flex flex-col p-4">
                  <DialogTitle className="text-lg font-semibold">
                    Materials Status
                  </DialogTitle>
                  <ol className="overflow-y-auto border rounded">
                    {report?.materials?.split("\n").map((eq, i) => {
                      return (
                        <li key={i} className="hover:bg-accent px-3 py-1">
                          {eq}
                        </li>
                      );
                    })}
                  </ol>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex justify-between items-center p-3 bg-background rounded border">
              <h2 className="text-base font-semibold">Equipment Status</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Open
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-h-96 max-h-svh flex flex-col p-4">
                  <DialogTitle className="text-lg font-semibold">
                    Equipment Status
                  </DialogTitle>
                  <ol className="overflow-y-auto border rounded">
                    {report?.equiptment?.split("\n").map((eq, i) => {
                      return (
                        <li key={i} className="hover:bg-accent px-3 py-1">
                          {eq}
                        </li>
                      );
                    })}
                  </ol>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div>
            <div className="rounded border p-3 bg-background space-y-2">
              <h2 className="text-base font-semibold">Site Personel</h2>
              <div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Contractor</TableHead>
                      <TableCell className="whitespace-pre-line">
                        {report?.contractors ?? "--"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Engineers</TableHead>
                      <TableCell className="whitespace-pre-line">
                        {report?.engineers ?? "--"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Workers</TableHead>
                      <TableCell className="whitespace-pre-line">
                        {report?.workers ?? "--"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Visitors</TableHead>
                      <TableCell className="whitespace-pre-line">
                        {report?.visitors ?? "--"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ol className="flex flex-col gap-4">
        {sections?.map((section) => {
          return (
            <li key={section.id}>
              <ReportSection section={section} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export async function ReportDocument({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
  fileId: number;
}) {
  const [site, report, sections /* sectionFiles */] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.getSiteReportDetails(reportId),
    Actions.getSiteReportSections(reportId),
    // Actions.getFilesForReport(reportId),
  ]);
  const props = { site, report, sections };
  return <ReportDocumentDisplay {...props} />;
}

export async function ReportDocumentNull() {
  return <ReportDocumentDisplay />;
}
