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
  LucideFileText,
  LucideVideo,
} from "lucide-react";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
}

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
    e.preventDefault();
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
        revalidate: true,
        optimisticData,
      },
    );
  };

  const onSelectReport = (r: SiteReport) => {
    setSelectedFile((f?: HaruFile) => undefined);
    setSelectedReport(r);
  };

  const noreports = !reports || reports.length < 1;
  return (
    <div className="shrink-0 flex flex-col min-h-0 w-56 gap-4 pt-12">
      <form onSubmit={addSiteReportOnSubmit} className="flex flex-col pr-4">
        <Button>Add Example Report</Button>
      </form>
      <div className={cn("text-center pt-16", noreports ? "" : "hidden")}>
        No Site Reports
      </div>
      <ScrollArea className={cn("grow min-h-0", noreports ? "hidden" : "")}>
        <ol className="flex flex-col gap-2 p-1 pr-4">
          {reports?.map((r, i) => (
            <li
              key={i}
              className="flex flex-col"
              onClick={() => onSelectReport(r)}
            >
              <Button
                className={cn(
                  "h-full w-full p-3 flex items-center",
                  selectedReport?.id === r.id ? "outline" : "",
                )}
                variant="secondary"
                disabled={selectedReport?.id === r.id}
              >
                <div className="grow text-left">
                  <div>
                    {r.createdAt?.toLocaleDateString()}{" "}
                    <span className="text-xs font-normal">{`(${r.id})`}</span>
                  </div>
                  <div>{r.reporter?.name}</div>
                </div>
              </Button>
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
    async () => {
      if (!selectedReport) return [];
      // fetch("/api/v1/report/files/${id}")
      const files = await Actions.getFilesForReport(selectedReport.id);
      return files || [];
    },
  );

  // const addReportFileBound = Actions.addReportFile.bind(null, selectedReport?.id);
  const [isUploading, setIsUploading] = useState(false);

  if (!selectedFile && files?.length) {
    setSelectedFile(files[0]);
  }

  const [mimeFilter, setMimeFilter] = useState("");

  const filters = [
    { label: "All", mime: ""},
    { label: "Pictures", mime: "image/" },
    { label: "Videos", mime: "video/" },
  ];

  const filteredFiles = files?.filter((f) => {
    return f.type?.startsWith(mimeFilter);
  });

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

  return (
    <div className="shrink-0 flex flex-col w-44 pt-12 gap-3">
      <div className="grid gap-2 w-44 px-1">
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
      </div>

      <ScrollArea>
        <ul className="flex flex-col gap-1 p-1 w-44">
          {filteredFiles?.map((r, i) => (
            <li key={i}>
              <Button
                variant="secondary"
                onClick={() => setSelectedFile(r)}
                className={cn(
                  "gap-2 px-3 w-full justify-start",
                  r.id === selectedFile?.id ? "outline" : "",
                )}
                disabled={r.id === selectedFile?.id}
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
            </li>
          ))}
        </ul>
      </ScrollArea>
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
        "h-[36rem] w-full flex flex-col gap-8 items-center justify-center relative",
        // "overflow-y-scroll",
        "border-4 border-black",
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
          <video controls className="max-w-full max-h-full">
            <source src={selectedFile.url} type={selectedFile.type} />
          </video>
        ) : (
          <pre className="text-begin w-full overflow-hidden p-8">
            {JSON.stringify(selectedFile, undefined, 4)}
          </pre>
        ))}
    </div>
  );
}

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

      <main className="grow min-h-0 min-w-0">
        <div className="flex h-full min-h-0 max-w-7xl mx-auto gap-4 py-8">
          <FileSelector {...props} />
          {/* <div className="flex h-full min-h-0 mx-auto gap-4 py-8"> */}
          <div className="grow flex flex-col min-w-0 gap-4">
            <div className="flex justify-between">
              <h3>Site Report - {selectedReport?.createdAt?.toDateString()}</h3>
              <Button
                className="hidden"
                variant="destructive"
                onClick={() => {
                  selectedReport && Actions.deleteSiteReport(selectedReport.id);
                  setSelectedReport(() => undefined);
                }
                }
              >
                Delete Report
              </Button>
            </div>
            <FileDisplay {...props} />
          </div>
          <ReportsList {...props} />
        </div>
      </main>
    </div>
  );
}
