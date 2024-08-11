"use client";

import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import * as Actions from "@/lib/actions/reports";
import { LucideCamera, LucideChevronRight } from "lucide-react";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { HaruFile } from "@/lib/types";
import { SiteReport } from "@/lib/types/site";

function ReportsListSkeleton() {
  return <div className="shrink-0 flex flex-col min-h-0 w-72">Loading...</div>;
}

function ReportsList({
  siteId,
  selectedReport,
  setSelectedReport,
}: {
  siteId: number;
  selectedReport?: SiteReport;
  setSelectedReport: (s: SiteReport) => void;
}) {
  const { data: reports, isLoading } = useSWR(
    `/api/site/${siteId}/reports`, // api route doesn't really exist
    () => {
      return Actions.getSiteReports(siteId) || [];
    },
  );

  const addSiteReportBound = Actions.addSiteReport.bind(null, siteId);

  if (isLoading) {
    return <ReportsListSkeleton />;
  }

  if (!reports || reports.length < 1) {
    return (
      <div className="shrink-0 flex flex-col min-h-0 w-72 py-28 px-8">
        <form action={addSiteReportBound} className="flex flex-col">
          <Button>Add Example Report</Button>
        </form>
        <div className="text-center pt-16">No Site Reports</div>
      </div>
    );
  }

  return (
    <div className="shrink-0 flex flex-col min-h-0 w-72">
      <div className="p-4 border-b">
        <p>Search </p>
        <Input />
      </div>
      <form action={addSiteReportBound} className="flex flex-col">
        <Button>Add Example Report</Button>
      </form>
      <ScrollArea className="grow min-h-0 bg-muted">
        <ol className="flex flex-col gap-2 py-2">
          {reports?.map((r, i) => (
            <li
              key={i}
              className={cn(
                "flex flex-col border-b cursor-pointer",
                // pathname == `/site/${siteId}/report/${r.id}`
                selectedReport && selectedReport.id === r.id
                  ? "bg-accent"
                  : "bg-background ",
              )}
              onClick={() => {
                // window.history.pushState(
                //   null,
                //   "",
                //   `/site/${siteId}/report/${r.id}`,
                // );
                setSelectedReport(r);
              }}
            >
              <div className="h-full w-full p-3 flex items-center">
                <div className="grow">
                  <div>Date: {r.createdAt.toLocaleString()}</div>
                  <div>Reporter: {r.reporter?.name}</div>
                </div>
                <div>
                  <LucideChevronRight />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  );
}

function FileSelector({
  selectedReport,
  setSelectedFile,
}: {
  selectedReport?: SiteReport;
  setSelectedFile: (f: HaruFile) => void;
}) {
  const { data: files, isLoading } = useSWR(
    `/api/report/${selectedReport?.id}/files`, // api route doesn't really exist
    () => {
      if (!selectedReport) return [];
      return Actions.getFilesForReport(selectedReport.id) || [];
    },
  );

  const filters = [
    { label: "All" },
    { label: "Pictures" },
    { label: "Videos" },
    { label: "Documents" },
  ];

  return (
    <div className="flex min-w-0 h-64">
      <ScrollArea className="shrink-0 p-0 bg-muted">
        <div className="grid gap-2 w-36 py-2">
          <form action={() => {}}>
            <Button>Add Example File</Button>
          </form>
          {filters.map((f, i) => (
            <div key={i} className="p-2 bg-background cursor-pointer">
              {f.label}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator orientation="vertical" />

      {isLoading ? null : (
        <ScrollArea className="grow flex items-center justify-center min-w-0">
          <ul className="inline-block gap-4 p-4 items-center">
            {files?.map((r, i) => (
              <li
                key={i}
                className="inline-block mr-4 mb-4"
                onClick={() => setSelectedFile(r)}
              >
                <Card className="flex flex-col justify-center items-center p-0 overflow-hidden w-36 h-36">
                  <LucideCamera />
                  <Image
                    src={""}
                    alt={"missing image"}
                    width={120}
                    height={120}
                    className="border hidden"
                  />
                  <CardDescription>{r.filename}</CardDescription>
                </Card>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}

function FileDisplay({ selectedFile }: { selectedFile?: HaruFile }) {
  return (
    <div
      className={cn(
        "h-full w-full flex items-center justify-center",
        "bg-gradient-to-r from-cyan-100 to-blue-100",
      )}
    >
      <p className="text-2xl">work in progress</p>
      {selectedFile && (
        <Image src={selectedFile.url || ""} alt={selectedFile.filename} />
      )}
    </div>
  );
}

// export default function Page({ params }: { params: { slug: string[] } }) {
//   const origSiteId = params.slug.length > 0 ? Number(params.slug[0]) : NaN;
//   const origReportId =
//     params.slug.length >= 3 && params.slug[1] == "report"
//       ? Number(params.slug[2])
//       : NaN;
//   const origFileId =
//     params.slug.length >= 5 && params.slug[3] == "file"
//       ? Number(params.slug[4])
//       : NaN;

export default function Page({ params }: { params: { siteId: string } }) {
  const origSiteId = Number(params.siteId);
  const [siteId, setSiteId] = useState(origSiteId);
  const [selectedReport, setSelectedReport] = useState<SiteReport>();
  const [selectedFile, setSelectedFile] = useState<HaruFile>();

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="grow flex min-h-0 min-w-0">
        <ReportsList
          siteId={siteId}
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
        />
        <Separator orientation="vertical" />
        <div className="grow flex flex-col min-w-0">
          <FileDisplay selectedFile={selectedFile} />
          <Separator />
          <FileSelector
            selectedReport={selectedReport}
            setSelectedFile={setSelectedFile}
          />
        </div>
      </main>
    </div>
  );
}
