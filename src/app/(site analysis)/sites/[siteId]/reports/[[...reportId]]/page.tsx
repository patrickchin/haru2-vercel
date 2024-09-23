import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as Actions from "@/lib/actions";
import {
  LucideCamera,
  LucideFileText,
  LucideMoveLeft,
  LucideVideo,
} from "lucide-react";

import Header from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { HaruFile } from "@/lib/types";
import {
  SiteDetails,
  SiteReport,
  SiteReportDetails,
  SiteReportSection,
} from "@/lib/types/site";
import Footer from "@/components/footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BackButton from "@/components/back-button";
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

interface ReportsViewerProps {
  site?: SiteDetails;
  reportList?: SiteReport[];
  report?: SiteReportDetails;
  sections?: SiteReportSection[];

  fileList?: HaruFile[];
  file?: HaruFile;
}

function ReportsList({ site, reportList, report, file }: ReportsViewerProps) {
  const noreports = !reportList || reportList.length < 1;
  if (!site) return null;
  return (
    <div className="flex-none flex flex-col min-h-0 gap-4 w-56">
      <div className={cn("text-center pt-16", noreports ? "" : "hidden")}>
        No Site Reports
      </div>
      <ScrollArea className={cn("grow min-h-0", noreports ? "hidden" : "")}>
        <ol className="flex flex-col gap-2 p-1">
          {reportList?.map((r, i) => (
            <li key={i}>
              <Button
                className={cn(
                  "h-full w-full p-3 flex items-center",
                  report?.id === r.id ? "outline" : "",
                )}
                variant="secondary"
                // disabled={selectedReport?.id === r.id}
              >
                <Link href={`/sites/${site.id}/reports/${r.id}`} className="grow text-left">
                  <div>
                    {r.createdAt?.toLocaleDateString()}{" "}
                    <span className="text-xs font-normal">{`(${r.id})`}</span>
                  </div>
                  <div>{r.reporter?.name}</div>
                </Link>
              </Button>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  );
}

function FileSelector({ fileList, file }: ReportsViewerProps) {
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

function FileDisplay({ file }: ReportsViewerProps) {
  return (
    <div
      className={cn(
        "grow flex flex-col items-center justify-center relative",
        // "overflow-y-scroll",
        "border-4 border-black rounded",
        "bg-gradient-to-r from-cyan-100 to-blue-100",
      )}
    >
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
          <video controls className="max-w-full max-h-full">
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

function ReportTitle(params: ReportsViewerProps) {
  return (
    <div className="grow flex justify-between">
      <h3>Site Report - {params.report?.createdAt?.toDateString()}</h3>
      <div className="flex gap-2">
        {/* <Button variant="secondary">
          <Link href={`/sites/${params.siteId}/questions`}>Add Questions</Link>
        </Button> */}
      </div>
    </div>
  );
}

async function ReportSection({ section }: { section: SiteReportSection }) {
  const data = await Actions.getSiteReportSectionFiles(section.id);
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
          <div className="w-full overflow-x-auto border-2 p-2">
            <ul className="inline-flex gap-2">
              {data?.map((f: HaruFile) => (
                <li
                  key={f.id}
                  className="w-[150px] h-[100px] rounded border-2 border-black overflow-hidden p-1 relative hover:brightness-50"
                >
                  <Link href={f.url || ""} target="_blank">
                    <Image
                      src={f.url || ""}
                      alt={f.filename || "unknown image"}
                      // width={100}
                      // height={100}
                      fill={true}
                      className="object-cover"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReportDocument({ site, report, sections }: ReportsViewerProps) {
  if (!report) return <p>Select a report</p>;

  return (
    <div className="flex flex-col gap-4">
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
          <div className="space-x-2">
            <span className="font-bold">Date of Visit:</span>
            <span>
              {report?.visitDate?.toDateString() ??
                report?.createdAt?.toDateString() ??
                "Unknown"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          {/* <CardContent className="grid grid-cols-4 gap-4 p-4 pt-0"> */}
          {/* <CardContent className="flex p-4 pt-0"> */}

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h6>Site Activity</h6>
            <p>{report?.activity ?? "--"}</p>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h6>Site Personel</h6>

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
            <h6>Materials Status</h6>
            <p>{report?.materials ?? "--"}</p>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h6>Equiptment Status</h6>
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

export default async function Page({
  params,
  searchParams,
}: {
  params: { siteId: string; reportId?: string };
  searchParams?: { fileId: string };
}) {
  const siteId = Number(params.siteId);
  const reportId = Number(params.reportId);
  const fileId = Number(searchParams?.fileId);

  const [site, reportList, report, fileList, sections] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.getSiteReports(siteId),
    Actions.getSiteReportDetails(reportId),
    Actions.getFilesForReport(reportId),
    Actions.getSiteReportSections(reportId),
  ]);

  const file = fileList?.find((f) => f.id == fileId);

  const props: ReportsViewerProps = {
    site,
    reportList,
    report,
    sections,

    fileList,
    file,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center px-16 py-8 gap-4">
        {/* <div className="w-full max-w-7xl pl-60 pr-48">
          <ReportTitle {...props} />
        </div> */}
        <div className="flex gap-4 w-full max-w-[100rem] pr-48">
          <div className="flex-none w-56">
            <BackButton variant="outline" className="gap-4 w-full">
              <LucideMoveLeft />
              Back to Description
            </BackButton>
          </div>
          <ReportTitle {...props} />
        </div>
        {/* <section className="grid grid-cols-[14rem_auto_11rem] gap-4 w-full max-w-7xl h-[36rem]"> */}
        <section className="flex gap-4 w-full max-w-[100rem] h-[36rem]">
          <ReportsList {...props} />
          <FileDisplay {...props} />
          <FileSelector {...props} />
        </section>

        <section className="w-full max-w-4xl pt-8">
          <ReportDocument {...props} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
