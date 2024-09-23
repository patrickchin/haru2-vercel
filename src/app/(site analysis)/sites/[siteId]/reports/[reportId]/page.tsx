import Header from "@/components/header";
import Footer from "@/components/footer";
import { Suspense } from "react";
import {
  ReportDocument,
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
  ReportTitleBarDisplay,
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center md:px-16 py-8 gap-4">
        <section className="w-full max-w-5xl pb-3">
          <Suspense fallback={<ReportTitleBarDisplay />}>
            <ReportTitleBar {...props} />
          </Suspense>
        </section>

        <section className="w-full max-w-5xl">
          <Suspense fallback={<FileDisplay />}>
            <ReportFileDisplay {...props} />
          </Suspense>
        </section>

        <section className="w-full max-w-5xl">
          <Suspense fallback={<ReportDocumentNull />}>
            <ReportDocument {...props} />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}
