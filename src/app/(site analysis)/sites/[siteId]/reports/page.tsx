import Header from "@/components/header";
import Footer from "@/components/footer";
import * as Actions from "@/lib/actions";
import {
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
} from "./report-document";
import { redirect } from "next/navigation";
import { ReportFileDisplay } from "./report-file-viewer";

export default async function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);

  const reports = await Actions.getSiteReports(siteId);
  if (reports && reports?.length > 0) {
    redirect(`/sites/${params.siteId}/reports/${reports[0].id}`);
  }

  const props: ReportsViewerProps = { siteId, reportId: NaN, fileId: NaN };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center md:px-16 py-8 gap-4">
        <section className="w-full max-w-5xl pb-3">
          <ReportTitleBar {...props} />
        </section>

        <section className="w-full max-w-5xl">
          <ReportFileDisplay {...props} />
        </section>

        <section className="w-full max-w-5xl">
          <ReportDocumentNull />
        </section>
      </main>

      <Footer />
    </div>
  );
}
