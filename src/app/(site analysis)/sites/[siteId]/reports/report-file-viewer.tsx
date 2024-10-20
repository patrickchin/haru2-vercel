import * as Actions from "@/lib/actions";
import { FileDisplayCarousel } from "./report-file-viewer-client";

export async function ReportFileDisplay({
  siteId,
  reportId,
  fileId,
}: {
  siteId?: number;
  reportId?: number;
  fileId?: number;
}) {
  if (!reportId) return <FileDisplayCarousel className="opacity-50" />;
  const fileList = await Actions.listReportFiles(reportId);
  const file = fileList?.find((f) => f.id === fileId);
  return <FileDisplayCarousel fileList={fileList} file={file} />;
}
