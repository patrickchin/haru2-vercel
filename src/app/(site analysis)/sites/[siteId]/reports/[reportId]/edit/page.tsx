import { DefaultLayout } from "@/components/page-layouts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { editReportRoles } from "@/lib/permissions";
import { SiteReport } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { LucideMoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadAndManageFiles } from "./edit-upload";
import { UpdateSiteReportSections } from "./edit-sections";
import { EditReportDocument } from "./edit-details";
import { PublishButton } from "./publish-button";

async function EditReportHeader({ report }: { report: SiteReport }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Button asChild variant="secondary">
        <Link
          href={`/sites/${report.siteId}/reports/${report.id}`}
          className="flex gap-2"
        >
          <LucideMoveLeft />
          Back To Report
        </Link>
      </Button>
      <h1 className="font-semibold text-2xl grow">
        Editing Site Report #{report.id}: {report.createdAt?.toDateString()}
      </h1>
      <PublishButton reportId={report.id} disabled={!!report.publishedAt} />
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ siteId: string; reportId: string }>;
}) {
  const siteId = Number((await params).siteId);
  const reportId = Number((await params).reportId);
  const [report, memberRole] = await Promise.all([
    Actions.getSiteReport(reportId),
    Actions.getSiteRole(siteId),
  ]);
  if (!memberRole || !editReportRoles.includes(memberRole)) notFound();
  if (!report) notFound();

  return (
    <DefaultLayout className="max-w-none relative pt-0">
      <div className="w-full sticky top-0 z-30 py-4 bg-background border-b">
        <div className="max-w-5xl mx-auto">
          <EditReportHeader report={report} />
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {!report?.publishedAt ? (
          <>
            <UploadAndManageFiles reportId={reportId} />
            <EditReportDocument reportId={reportId} />
            <UpdateSiteReportSections siteId={siteId} reportId={reportId} />
          </>
        ) : (
          <div>
            <p>
              This report was published on{" "}
              {report?.publishedAt?.toLocaleString() ?? "--"}
            </p>
            <p>It can not longer be edited.</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
