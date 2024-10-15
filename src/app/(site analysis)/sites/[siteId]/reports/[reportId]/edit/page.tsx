import { DefaultLayout } from "@/components/page-layouts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadAndManageFiles } from "./edit-upload";
import { UpdateSiteReportSections } from "./edit-sections";
import { EditReportDocument } from "./edit-report-document";
import * as Actions from "@/lib/actions";
import { LucideBookOpenCheck, LucideMoveLeft } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { siteId: string; reportId: string };
}) {
  const siteId = Number(params.siteId);
  const reportId = Number(params.reportId);
  const memberRole = await Actions.getSiteRole(siteId);
  if (memberRole && ["supervisor", "owner", "manager"].includes(memberRole)) {
    return (
      <DefaultLayout className="max-w-5xl">
        <div className="flex items-center gap-4">
          <Button asChild variant="secondary">
            <Link
              href={`/sites/${siteId}/reports/${reportId}`}
              className="flex gap-2"
            >
              <LucideMoveLeft />
              Back To Report
            </Link>
          </Button>
          <h1 className="font-semibold text-2xl grow">
            Editing Report #{reportId}
          </h1>
          <Button variant="default" disabled className="cursor-not-allowed flex gap-2">
            Publish Report
            <LucideBookOpenCheck className="h-5 w-5"/>
          </Button>
        </div>
        <UploadAndManageFiles reportId={reportId} />
        <EditReportDocument reportId={reportId} />
        <UpdateSiteReportSections siteId={siteId} reportId={reportId} />
      </DefaultLayout>
    );
  } else {
    notFound();
  }
}
