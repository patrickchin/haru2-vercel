import { redirect } from "next/navigation";
import * as Actions from "@/lib/actions";

import { ReportTitleBar } from "./report-title";

import { DefaultLayout } from "@/components/page-layouts";
import { InfoBox } from "@/components/info-box";

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

  const props = { siteId };

  return (
    <DefaultLayout className="max-w-none relative p-0 pb-12">
      <section className="w-full sticky top-0 bg-background z-30 py-4 border-b">
        <div className="w-full max-w-5xl mx-auto">
          <ReportTitleBar {...props} />
        </div>
      </section>

      <div className="w-full max-w-5xl mx-auto mt-4">
        <InfoBox className="text-base">
          <p>This project does not have any published reports yet.</p>
          <p>
            After scheduling a meeting with us, our supervisor will visit your
            site and publish reports on this page.
          </p>
        </InfoBox>
      </div>
    </DefaultLayout>
  );
}
