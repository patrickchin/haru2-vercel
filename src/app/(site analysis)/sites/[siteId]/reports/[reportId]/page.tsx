import { Suspense } from "react";
import { DefaultLayout } from "@/components/page-layouts";
import {
  ReportDocument,
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
} from "../report-document";
import { FileDisplay, ReportFileDisplay } from "../report-file-viewer";

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

  const props: ReportsViewerProps = { siteId, reportId, fileId };

  return (
    <DefaultLayout>
      <section className="">
        {/* <Suspense fallback={<ReportTitleBarDisplay />}> */}
        <ReportTitleBar {...props} />
        {/* </Suspense> */}
      </section>

      <section className="">
        <Suspense fallback={<FileDisplay />}>
          <ReportFileDisplay {...props} />
        </Suspense>
      </section>

      <section className="">
        <Suspense fallback={<ReportDocumentNull />}>
          <ReportDocument {...props} />
        </Suspense>
      </section>
    </DefaultLayout>
  );
}