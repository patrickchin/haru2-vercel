import * as Actions from "@/lib/actions";
import { FileDisplayDialogCarouselClient } from "./report-file-viewer-client";

export async function FileDisplayDialogCarousel({
  reportId,
}: {
  reportId?: number;
}) {
  if (!reportId) return null;
  const fileList = await Actions.listReportFiles(reportId);
  return <FileDisplayDialogCarouselClient fileList={fileList} />;
}
