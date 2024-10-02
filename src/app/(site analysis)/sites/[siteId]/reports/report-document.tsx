import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { HaruFile } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { LucideChevronDown, LucideMoveLeft } from "lucide-react";
import { FileDisplay } from "@/components/file-display";
import { Button } from "@/components/ui/button";
import {
  SiteDetails,
  SiteReport,
  SiteReportBoth,
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <ol>
      {reports.map((r) => (
        <li key={r.id}>
          <Button variant="link" asChild>
            <Link
              href={`/sites/${site.id}/reports/${r.id}`}
              className={cn(
                "text-xl",
                report && report.id === r.id
                  ? "pointer-events-none opacity-50"
                  : "",
              )}
            >
              {`Site Report #${r.id} - ${r.createdAt?.toDateString() || "unknown date"}`}
            </Link>
          </Button>
        </li>
      ))}
    </ol>
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
  return (
    <div className="grow flex flex-row gap-3">
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

      <div className="grow flex justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="items-center justify-between gap-4 border-2 p-4"
            >
              <h1 className="text-2xl font-semibold justify-start">
                {report
                  ? `Site Report #${report.id} - ${report.createdAt?.toDateString()}`
                  : "Click here to select a report"}
              </h1>
              <LucideChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="px-8 py-6 w-fit" align="start">
            <ReportListPopup site={site} report={report} />
          </PopoverContent>
        </Popover>

        {site &&
          session &&
          session.user &&
          ["supervisor", "admin"].includes(session.user.role as string) && (
            <div className="flex gap-2">
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
                  <DialogTrigger>
                    <Image
                      src={f.url || ""}
                      alt={f.filename || "unknown image"}
                      fill={true}
                      className="object-cover w-full h-full"
                    />
                  </DialogTrigger>
                  <DialogContent
                    key="file-viewer-dialog-content"
                    className={cn(
                      "p-4 bg-transparent max-w-none max-h-none",
                      false ? "w-dvw h-dvh" : "w-11/12 h-[92%]",
                      true ? "border-none" : "border-4 border-black",
                      "bg-zinc-800",
                      // "bg-gradient-to-r from-cyan-100 to-blue-100",
                    )}
                  >
                    <Carousel
                      // className="w-full h-full"
                      opts={{ startIndex: i }}
                    >
                      <CarouselContent className="h-full">
                        {files?.map((f) => (
                          <CarouselItem key={f.id}>
                            <FileDisplay file={f} />
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
  report?: SiteReportBoth;
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

        <CardContent className="grid grid-cols-2 gap-4 p-4 pt-0">
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

      <Card className="bg-yellow-50 border-2">
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

        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          {/* <CardContent className="grid grid-cols-4 gap-4 p-4 pt-0"> */}
          {/* <CardContent className="flex p-4 pt-0"> */}

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h2 className="text-base font-semibold">Site Activity</h2>
            <p>{report?.activity ?? "--"}</p>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h2 className="text-base font-semibold">Site Personel</h2>

            <div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead>Contractor</TableHead>
                    <TableCell>{report?.contractors ?? "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Engineers</TableHead>
                    <TableCell>{report?.engineers ?? "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Workers</TableHead>
                    <TableCell>{report?.workers ?? "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Visitors</TableHead>
                    <TableCell>{report?.visitors ?? "--"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h2 className="text-base font-semibold">Materials Status</h2>
            <p>{report?.materials ?? "--"}</p>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h2 className="text-base font-semibold">Equiptment Status</h2>
            <p>{report?.equiptment ?? "--"}</p>
          </div>
        </CardContent>
      </Card>

      <ol className="flex flex-col gap-2">
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
