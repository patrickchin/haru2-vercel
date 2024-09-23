"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
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
  LucideLoader2,
  LucideMoveLeft,
  LucideUpload,
  LucideVideo,
} from "lucide-react";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { HaruFile, nullHaruFile } from "@/lib/types";
import {
  nullSiteReport,
  SiteDetails,
  SiteReport,
  SiteReportSection,
} from "@/lib/types/site";
import { uploadReportFile, uploadReportSectionFile } from "@/lib/utils/upload";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Footer from "@/components/footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BackButton from "@/components/back-button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
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
  siteId: number;
  siteDetails: SiteDetails | undefined;
  report: SiteReport | undefined;
  setReport: Dispatch<SetStateAction<SiteReport | undefined>>;

  selectedFile: HaruFile | undefined;
  setSelectedFile: Dispatch<SetStateAction<HaruFile | undefined>>;
}

function ReportsList({
  siteId,
  report,
  setReport,
  setSelectedFile,
}: ReportsViewerProps) {
  const {
    data: reports,
    mutate: mutateReports,
    isLoading,
  } = useSWR(
    `/api/sites/${siteId}/reports`, // api route doesn't really exist
    () => {
      return Actions.getSiteReports(siteId);
    },
  );

  const addSiteReportOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    const optimisticData: SiteReport[] = (() => {
      const optimisticReport: SiteReport = {
        ...nullSiteReport,
        siteId,
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
    setReport(r);
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
                  report?.id === r.id ? "outline" : "",
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
  report,
  selectedFile,
  setSelectedFile,
}: ReportsViewerProps) {
  const {
    data: files,
    mutate,
    isLoading,
  } = useSWR<HaruFile[] | undefined>(
    `/api/report/${report?.id}/files`, // api route doesn't really exist
    async () => {
      if (!report) return [];
      // fetch("/api/v1/report/files/${id}")
      const files = await Actions.getFilesForReport(report.id);
      return files || [];
    },
  );

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
    if (!report) return;
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
            const f = await uploadReportFile(report.id, file);
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
        <Button className={cn("p-0", report ? "" : "hidden")}>
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

function FileDisplay({ selectedFile }: ReportsViewerProps) {
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
      <h3>Site Report - {params.report?.createdAt?.toDateString()}</h3>
      <div className="flex gap-2">
        <Button variant="secondary">
          <Link href={`/sites/${params.siteId}/questions`}>Add Questions</Link>
        </Button>
        <Button
          // className="hidden"
          variant="destructive"
          onClick={() => {
            params.report && Actions.deleteSiteReport(params.report.id);
            params.setReport(() => undefined);
          }}
        >
          Delete Report
        </Button>
      </div>
    </div>
  );
}

function ReportSection({ section }: { section: SiteReportSection }) {
  const { data, error, mutate } = useSWR<HaruFile[] | undefined>(
    `/api/sections/${section?.id}/files`,
    () => {
      return Actions.getSiteReportSectionFiles(section.id);
    },
  );

  const uploadFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(targetFiles)) {
        const f = await uploadReportSectionFile(section.id, file);
        mutate();
      }
      e.target.value = "";
    } catch (e) {
      toast({ description: `Error: ${e}` });
    } finally {
      setIsUploading(false);
    }
  }

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
          <div className="space-y-3">
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
            <Input
              type="file"
              id={`section-${section.id}-upload-file`}
              className="hidden"
              ref={uploadFileInputRef}
              onChange={onChangeUploadFile}
              disabled={isUploading}
              multiple
            />
            <Button
              asChild
              type="button"
              variant="secondary"
              disabled={isUploading}
            >
              <Label
                htmlFor={`section-${section.id}-upload-file`}
                className={cn(
                  "gap-x-2",
                  isUploading ? "cursor-progress" : "cursor-pointer",
                )}
              >
                {isUploading ? (
                  <>
                    Uploading
                    <LucideLoader2 className="animate-spin w-4" />
                  </>
                ) : (
                  <>
                    Add Attachment <LucideUpload className="w-4" />
                  </>
                )}
              </Label>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReportDocument({ siteId, siteDetails, report }: ReportsViewerProps) {
  const {
    data: reportDetails,
    error: reportDetailsError,
    mutate: reportDetailsMutate,
  } = useSWR(`/api/sites/${siteId}/report/${report?.id}/details`, () => {
    if (report) return Actions.getSiteReportDetails(report.id);
  });

  const {
    data: reportSections,
    error: reportSectionsError,
    mutate: reportSectionsMutate,
  } = useSWR(`/api/sites/${siteId}/report/${report?.id}/sections`, () => {
    if (report) return Actions.getSiteReportSections(report.id);
  });

  const formSchema = z.object({
    title: z.string(),
    content: z.string(),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormSchemaType) {
    if (!report) return; // TODO error
    // form.clearErrors();
    form.reset();

    const ret = await Actions.addSiteReportSection(report.id, data);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            data: {JSON.stringify(data, null, 2)} <br />
            ret: {JSON.stringify(ret, null, 2)} <br />
          </code>
        </pre>
      ),
    });

    reportSectionsMutate();
  }

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
                <TableCell>{reportDetails?.address ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Visit Date</TableHead>
                <TableCell>
                  {reportDetails?.visitDate?.toDateString() ?? "--"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableCell>{reportDetails?.ownerName ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableCell>{siteDetails?.contractorName ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Supervisor</TableHead>
                <TableCell>{reportDetails?.supervisorName ?? "--"}</TableCell>
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
                <TableCell>{reportDetails?.budget ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Budget Spent</TableHead>
                <TableCell>{reportDetails?.spent ?? "--"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Construction Timeline</TableHead>
                <TableCell>{reportDetails?.timeline ?? "--"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Completion Date</TableHead>
                <TableCell>
                  {reportDetails?.completion?.toDateString() ?? "--"}
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
            <p>{reportDetails?.activity ?? "--"}</p>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h6>Site Personel</h6>

            <div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead>Contractor</TableHead>
                    <TableCell>{reportDetails?.contractors ?? "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Engineers</TableHead>
                    <TableCell>{reportDetails?.engineers ?? "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Workers</TableHead>
                    <TableCell>{reportDetails?.workers ?? "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Visitors</TableHead>
                    <TableCell>{reportDetails?.visitors ?? "--"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h6>Materials Status</h6>
            <p>{reportDetails?.materials ?? "--"}</p>
          </div>

          <div className="basis-1/4 border p-4 bg-background space-y-2">
            <h6>Equiptment Status</h6>
            <p>{reportDetails?.equiptment ?? "--"}</p>
          </div>
        </CardContent>
      </Card>

      <ol className="flex flex-col gap-2">
        {reportSections?.map((section) => {
          return (
            <li key={section.id}>
              <ReportSection section={section} />
            </li>
          );
        })}
      </ol>

      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="section title .. " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Section Details</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="details" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Add Section</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default function Page({ params }: { params: { siteId: string } }) {
  const origSiteId = Number(params.siteId);
  const [siteId, setSiteId] = useState(origSiteId);
  const [report, setReport] = useState<SiteReport>();
  const [selectedFile, setSelectedFile] = useState<HaruFile>();

  const { data: siteDetails, mutate: mutateDetails } = useSWR(
    `/api/sites/${siteId}/details`, // api route doesn't really exist
    () => Actions.getSiteDetails(siteId),
  );

  const props: ReportsViewerProps = {
    siteId,
    siteDetails,
    report,
    setReport,
    selectedFile,
    setSelectedFile,
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
