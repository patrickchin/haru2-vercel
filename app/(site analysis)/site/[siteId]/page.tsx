"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import Image from "next/image";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import * as Actions from "@/lib/actions";
import {
  LucideCamera,
  LucideChevronRight,
  LucideFileText,
  LucideVideo,
} from "lucide-react";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { HaruFile, nullHaruFile } from "@/lib/types";
import { nullSiteReport, SiteReport } from "@/lib/types/site";
import { uploadReportFile } from "@/lib/utils/upload";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface ReportsViewerProps {
  siteId: number;
  selectedFile: HaruFile | undefined;
  setSelectedFile: Dispatch<SetStateAction<HaruFile | undefined>>;
  selectedReport: SiteReport | undefined;
  setSelectedReport: Dispatch<SetStateAction<SiteReport | undefined>>;
};

function ReportsList({
  siteId,
  selectedFile,
  setSelectedFile,
  selectedReport,
  setSelectedReport,
}: ReportsViewerProps) {
  const {
    data: reports,
    mutate: mutateReports,
    isLoading,
  } = useSWR(
    `/api/site/${siteId}/reports`, // api route doesn't really exist
    () => {
      return Actions.getSiteReports(siteId);
    },
  );

  const addSiteReportOnSubmit = (e: FormEvent) => {
    const optimisticData: SiteReport[] = (() => {
      const optimisticReport = {
        ...nullSiteReport,
        siteId: siteId,
      };
      return reports ? [optimisticReport, ...reports] : [optimisticReport];
    })();
    mutateReports(
      async (cur: SiteReport[] | undefined) => {
        const report = await Actions.addSiteReport(siteId);
        if (!report) return cur;
        if (!cur) return [report];
        return [report, ...cur];
      },
      {
        revalidate: false,
        optimisticData,
      },
    );
  };

  const onSelectReport = (r: SiteReport) => {
    // window.history.pushState(
    //   null,
    //   "",
    //   `/site/${siteId}/report/${r.id}`,
    // );
    setSelectedFile((f?: HaruFile) => undefined);
    setSelectedReport(r);
  };

  if (isLoading) {
    return (
      <div className="shrink-0 flex flex-col min-h-0 w-72">Loading...</div>
    );
  }

  if (!reports || reports.length < 1) {
    return (
      <div className="shrink-0 flex flex-col min-h-0 w-72 py-28 px-8">
        <form onSubmit={addSiteReportOnSubmit} className="flex flex-col">
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
      <form onSubmit={addSiteReportOnSubmit} className="flex flex-col">
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
              onClick={() => onSelectReport(r)}
            >
              <div className="h-full w-full p-3 flex items-center">
                <div className="grow">
                  <div>Date: {r.createdAt?.toLocaleString()}</div>
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
  siteId,
  selectedFile,
  setSelectedFile,
  selectedReport,
  setSelectedReport,
}: ReportsViewerProps) {
  const {
    data: files,
    mutate,
    isLoading,
  } = useSWR<HaruFile[] | undefined>(
    `/api/report/${selectedReport?.id}/files`, // api route doesn't really exist
    () => {
      if (!selectedReport) return [];
      return Actions.getFilesForReport(selectedReport.id) || [];
    },
  );

  // const addReportFileBound = Actions.addReportFile.bind(null, selectedReport?.id);
  const [isUploading, setIsUploading] = useState(false);

  if (!selectedFile && files?.length) {
    setSelectedFile(files[0]);
  }

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!selectedReport) return;
    if (!targetFiles || targetFiles.length <= 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(targetFiles)) {
        const optimisticData = (() => {
          const newFile: HaruFile = {
            ...nullHaruFile,
            filename: file.name,
            type: file.type,
          };
          return files ? [...files, newFile] : [newFile];
        })();
        mutate(
          async (cur: HaruFile[] | undefined) => {
            const f = await uploadReportFile(selectedReport.id, file);
            if (!f) return cur;
            if (!cur) return [f];
            return [...cur, f];
          },
          { revalidate: false, optimisticData },
        );
      }
      e.target.value = "";
    } catch (e) {
      toast({ description: `Error: ${e}` });
    } finally {
      setIsUploading(false);
    }
  }
  const filters = [
    { label: "All" },
    { label: "Pictures" },
    { label: "Videos" },
    { label: "Documents" },
  ];

  return (
    <div className="flex min-w-0 max-h-64 min-h-64">
      <ScrollArea className="shrink-0 p-0 bg-muted">
        <div className="grid gap-2 w-36 py-2">
          <Button className={cn("p-0", selectedReport ? "" : "hidden")}>
            <Label
              htmlFor="upload-report-file"
              className="flex w-full h-full cursor-pointer justify-center items-center"
            >
              Add Example File
              <Input
                type="file"
                id="upload-report-file"
                className="hidden"
                onChange={onChangeUploadFile}
                disabled={isUploading}
                multiple
              />
            </Label>
          </Button>

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
          <ul className="flex flex-wrap gap-2 p-4 items-center">
            {files?.map((r, i) => (
              <li key={i} onClick={() => setSelectedFile(r)}>
                <Card className="flex flex-col justify-center items-center p-2 overflow-hidden w-28 h-28">
                  {(r.type?.startsWith("image/") &&
                    ((r.url && r.url.length > 0 && (
                      <div className="w-full grow relative">
                        <Image
                          src={r.url}
                          alt={"missing image"}
                          fill={true}
                          objectFit="contain"
                        />
                      </div>
                    )) || <LucideCamera className="grow" />)) ||
                    (r.type?.startsWith("video/") && (
                      <LucideVideo className="grow" />
                    )) || (
                      <LucideFileText className="grow" />
                    )
                    }
                  <CardDescription className="w-full text-nowrap text-center overflow-hidden">
                    {r.filename}
                  </CardDescription>
                </Card>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}

function FileDisplay({
  siteId,
  selectedFile,
  setSelectedFile,
  selectedReport,
  setSelectedReport,
}: ReportsViewerProps) {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col gap-8 items-center justify-center",
        "overflow-y-scroll relative",
        "bg-gradient-to-r from-cyan-100 to-blue-100",
      )}
    >
      {selectedFile &&
        selectedFile.url &&
        selectedFile.url.length > 0 &&
        selectedFile.type &&
        (selectedFile.type?.startsWith("image/") ? (
          <Image
            src={selectedFile.url}
            alt={selectedFile.filename || "<Untitled>"}
            fill={true}
            objectFit="contain"
          />
        ) : selectedFile.type?.startsWith("video/") ? (
          <video controls>
            <source src={selectedFile.url} type={selectedFile.type} />
          </video>
        ) : (
          <pre className="text-begin w-full">
            {JSON.stringify(selectedFile, undefined, 4)}
          </pre>
        ))}
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

  const props: ReportsViewerProps = {
    siteId,
    selectedFile,
    setSelectedFile,
    selectedReport,
    setSelectedReport,
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="grow flex min-h-0 min-w-0">
        <ReportsList {...props} />
        <Separator orientation="vertical" />
        <div className="grow flex flex-col min-w-0">
          <FileDisplay {...props} />
          <Separator />
          <FileSelector {...props} />
        </div>
      </main>
    </div>
  );
}
