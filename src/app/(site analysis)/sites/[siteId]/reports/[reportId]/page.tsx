import { Suspense } from "react";
import { DefaultLayout } from "@/components/page-layouts";
import {
  ReportDocument,
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
} from "../report-document";
import { ReportFileDisplay } from "../report-file-viewer";
import { FileDisplay } from "@/components/file-display";

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

  return (
    <DefaultLayout className="max-w-none relative p-0 pb-12">
      <section className="w-full sticky top-0 bg-background z-30 py-4 border-b">
        <div className="w-full max-w-5xl mx-auto">
          {/* <Suspense fallback={<ReportTitleBarDisplay />}> */}
          <ReportTitleBar {...props} />
          {/* </Suspense> */}
        </div>
      </section>

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
