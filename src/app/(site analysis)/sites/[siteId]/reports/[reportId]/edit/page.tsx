import { DefaultLayout } from "@/components/page-layouts";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allowEditAfterPublish, editReportRoles } from "@/lib/permissions";
import { SiteReport } from "@/lib/types";
import * as Actions from "@/lib/actions";

import { LucideMoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBox, WarningBox } from "@/components/info-box";
import { EditReportFiles } from "./edit-upload";
import { EditReportSections } from "./edit-sections";
import { PublishButton } from "./publish-button";
import { DeleteReportButton } from "./delete-report";
import { EditReportActivities } from "./edit-activities";

async function EditReportHeader({ report }: { report: SiteReport }) {
  return (
    <div className="flex flex-col flex-wrap sm:flex-row sm:items-center gap-4">
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
      <DeleteReportButton
        siteId={report.siteId}
        reportId={report.id}
        disabled={!!report.publishedAt}
      />
      <PublishButton reportId={report.id} disabled={!!report.publishedAt} />
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ siteId: string; reportId: string }>;
}) {
  const session = await auth();
  const siteId = Number((await params).siteId);
  const reportId = Number((await params).reportId);
  const [report, memberRole] = await Promise.all([
    Actions.getSiteReport(reportId),
    Actions.getSiteRole(siteId),
  ]);
  if (!memberRole || !editReportRoles.includes(memberRole)) notFound();
  if (!report) notFound();

  return (
    <DefaultLayout className="max-w-none relative p-0">
      <div className="w-full sticky top-0 z-30 py-4 bg-background border-b shadow-md">
        <div className="max-w-5xl mx-auto">
          <EditReportHeader report={report} />
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {report?.deletedAt ? (
          <ErrorBox className="w-full max-w-5xl mx-auto">
            This report has been deleted.
          </ErrorBox>
        ) : null}

        {!report?.publishedAt ||
        allowEditAfterPublish ||
        session?.user?.role === "admin" ? (
          <>
            <EditReportFiles reportId={reportId} />
            <EditReportActivities siteId={siteId} reportId={reportId} />
            <EditReportSections siteId={siteId} reportId={reportId} />
          </>
        ) : (
          <WarningBox>
            This report was published on{" "}
            <code className="bg-accent p-1">
              {report?.publishedAt?.toString() ?? "--"}
            </code>{" "}
            and can no longer be edited.
          </WarningBox>
        )}
      </div>
    </DefaultLayout>
  );
}
