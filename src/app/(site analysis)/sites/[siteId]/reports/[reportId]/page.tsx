import { Suspense } from "react";
import * as Actions from "@/lib/actions";
import { DefaultLayout } from "@/components/page-layouts";
import {
  ReportDocument,
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
} from "../report-document";
import { ReportFileDisplay } from "../report-file-viewer";
import { FileDisplay } from "@/components/file-display";
import { WarningBox } from "@/components/info-box";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; reportId?: string }>;
  searchParams?: Promise<{ fileId: string }>;
}) {
  const params2 = await params;
  const siteId = Number(params2.siteId);
  const reportId = Number(params2.reportId);
  const fileId = Number((await searchParams)?.fileId);

  const props: ReportsViewerProps = { siteId, reportId, fileId };
  const report = await Actions.getSiteReport(reportId);

  return (
    <DefaultLayout className="max-w-none relative p-0 pb-12">
      <section className="w-full sticky top-0 bg-background z-30 py-4 border-b">
        <div className="w-full max-w-5xl mx-auto">
          {/* <Suspense fallback={<ReportTitleBarDisplay />}> */}
          <ReportTitleBar {...props} />
          {/* </Suspense> */}
        </div>
      </section>

      {report?.publishedAt ? null : (
        <WarningBox className="w-full max-w-5xl mx-auto font-semibold text-lg">
          This report has NOT yet been published so normal members of this
          project cannot yet view this report. <br />
          To publish this report go to the edit page.
        </WarningBox>
      )}

      <section className="w-full mx-auto">
        <Suspense fallback={<FileDisplay />}>
          <ReportFileDisplay {...props} />
        </Suspense>
      </section>

      <section className="w-full max-w-5xl mx-auto">
        <Suspense fallback={<ReportDocumentNull />}>
          <ReportDocument {...props} />
        </Suspense>
      </section>
    </DefaultLayout>
  );
}
