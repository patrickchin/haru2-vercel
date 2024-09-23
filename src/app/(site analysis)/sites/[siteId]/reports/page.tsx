import * as Actions from "@/lib/actions";
import {
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
} from "./report-document";
import { redirect } from "next/navigation";
import { ReportFileDisplay } from "./report-file-viewer";
import { DefaultLayout } from "@/components/page-layouts";

export default async function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);

  const reports = await Actions.getSiteReports(siteId);
  if (reports && reports?.length > 0) {
    redirect(`/sites/${params.siteId}/reports/${reports[0].id}`);
  }

  const props: ReportsViewerProps = { siteId, reportId: NaN, fileId: NaN };

  return (
    <DefaultLayout>
      <section className="">
        <ReportTitleBar {...props} />
      </section>

      <section className="">
        <ReportFileDisplay {...props} />
      </section>

      <section className="">
        <ReportDocumentNull />
      </section>
    </DefaultLayout>
  );
}
