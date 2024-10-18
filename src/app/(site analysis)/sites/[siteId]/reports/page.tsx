import * as Actions from "@/lib/actions";
import {
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
} from "./report-document";
import { redirect } from "next/navigation";
import { ReportFileDisplay } from "./report-file-viewer";
import { DefaultLayout } from "@/components/page-layouts";
import { InfoBox } from "@/components/info-box";

export default async function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);

  const reports = await Actions.getSiteReports(siteId);
  if (reports && reports?.length > 0) {
    redirect(`/sites/${params.siteId}/reports/${reports[0].id}`);
  }

  const props: ReportsViewerProps = { siteId, reportId: NaN, fileId: NaN };

  return (
    <DefaultLayout className="max-w-none relative p-0 pb-12">
      <section className="w-full sticky top-0 bg-background z-30 py-4 border-b">
        <div className="w-full max-w-5xl mx-auto">
          <ReportTitleBar {...props} />
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto">
        <ReportFileDisplay {...props} />
      </section>

      <section className="w-full max-w-5xl mx-auto">
        <ReportDocumentNull />
      </section>
    </DefaultLayout>
  );
}
