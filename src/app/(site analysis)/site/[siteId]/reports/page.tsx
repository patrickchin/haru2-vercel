"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import * as Actions from "@/lib/actions";
import {
  LucideCamera,
  LucideFileText,
  LucideMoveLeft,
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
import Footer from "@/components/footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BackButton from "@/components/back-button";

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
    <div className="flex-none flex flex-col min-h-0 gap-4 w-56">
      <form onSubmit={addSiteReportOnSubmit} className="flex flex-col p-1">
        <Button>Add Example Report</Button>
      </form>
      <div className={cn("text-center pt-16", noreports ? "" : "hidden")}>
        No Site Reports
      </div>
      <ScrollArea className={cn("grow min-h-0", noreports ? "hidden" : "")}>
        <ol className="flex flex-col gap-2 p-1">
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
                // disabled={selectedReport?.id === r.id}
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
    { label: "All", mime: "" },
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
    <div className="flex-none flex flex-col gap-3">
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
              // disabled={isUploading}
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
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedFile(r)}
                      className={cn(
                        "gap-2 px-3 w-full justify-start",
                        r.id === selectedFile?.id ? "outline" : "",
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
        "grow flex flex-col items-center justify-center relative",
        // "overflow-y-scroll",
        "border-4 border-black rounded",
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
            className="object-contain"
          />
        ) : selectedFile.type?.startsWith("video/") ? (
          <video controls className="max-w-full max-h-full">
            <source src={selectedFile.url} type={selectedFile.type} />
          </video>
        ) : (
          <div className="relative w-full h-full overflow-auto p-6">
            <pre className="absolute text-begin overflow-hidden">
              {JSON.stringify(selectedFile, undefined, 4)}
            </pre>
          </div>
        ))}
    </div>
  );
}

function ReportTitle(params: ReportsViewerProps) {
  return (
    <div className="grow flex justify-between">
      <h3>Site Report - {params.selectedReport?.createdAt?.toDateString()}</h3>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => {}}>
          <Link href={`/site/${params.siteId}/questions`}>Add Questions</Link>
        </Button>
        <Button
          // className="hidden"
          variant="destructive"
          onClick={() => {
            params.selectedReport &&
              Actions.deleteSiteReport(params.selectedReport.id);
            params.setSelectedReport(() => undefined);
          }}
        >
          Delete Report
        </Button>
      </div>
    </div>
  );
}

function ReportDocument() {
  const cnlabel = "font-bold text-end";
  const cnvalue = "";
  return (
    <div className="grid grid-cols-[15rem_1fr] w-full gap-4">
      <div className={cnlabel}>Visit Conducted By</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>Site Address</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>Site Condition</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>Work in Progress</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>Observations</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>Additional Details</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>In Charge Signature</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>Engineer Signature</div>
      <div className={cnvalue}>a</div>
      <div className={cnlabel}>Visitor Signature</div>
      <div className={cnvalue}>a</div>
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center px-16 py-8 gap-4">
        {/* <div className="w-full max-w-7xl pl-60 pr-48">
          <ReportTitle {...props} />
        </div> */}
        <div className="flex gap-4 w-full max-w-7xl pr-48">
          <div className="flex-none w-56">
            <BackButton variant="outline" className="gap-4 w-full">
              <LucideMoveLeft />
              Back to Description
            </BackButton>
          </div>
          <ReportTitle {...props} />
        </div>
        {/* <section className="grid grid-cols-[14rem_auto_11rem] gap-4 w-full max-w-7xl h-[36rem]"> */}
        <section className="flex gap-4 w-full max-w-7xl h-[36rem]">
          <ReportsList {...props} />
          <FileDisplay {...props} />
          <FileSelector {...props} />
        </section>

        <section className="w-full max-w-7xl pl-60 pr-48 pt-8">
          <ReportDocument />
        </section>
      </main>

      <Footer />
    </div>
  );
}
