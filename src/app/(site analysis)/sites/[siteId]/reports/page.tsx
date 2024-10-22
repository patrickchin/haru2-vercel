import * as Actions from "@/lib/actions";
import {
  ReportDocumentNull,
  ReportsViewerProps,
  ReportTitleBar,
} from "./report-document";
import { redirect } from "next/navigation";
import { ReportFileDisplay } from "./report-file-viewer";
import { DefaultLayout } from "@/components/page-layouts";
import { WarningBox } from "@/components/info-box";

export default async function Page({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const siteId = Number((await params).siteId);

  const reports = await Actions.listSiteReports(siteId);
  if (reports && reports?.length > 0) {
    redirect(`/sites/${siteId}/reports/${reports[0].id}`);
  }

  const props: ReportsViewerProps = { siteId };

  return (
    <DefaultLayout className="max-w-none relative p-0 pb-12">
      <section className="w-full sticky top-0 bg-background z-30 py-4 border-b">
        <div className="w-full max-w-5xl mx-auto">
          <ReportTitleBar {...props} />
        </div>
      </section>

      <div className="w-full max-w-5xl mx-auto">
        <WarningBox className="font-semibold text-base">
          This project does not have any published reports yet. <br />
          After scheduling a meeting with us, our supervisor will visit your
          site and publish reports on this page.
        </WarningBox>
      </div>

      <section className="w-full max-w-5xl mx-auto">
        <ReportFileDisplay {...props} />
      </section>

      <section className="w-full max-w-5xl mx-auto">
        <ReportDocumentNull />
      </section>
    </DefaultLayout>
  );
}
