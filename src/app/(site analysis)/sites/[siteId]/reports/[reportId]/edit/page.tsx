import { DefaultLayout } from "@/components/page-layouts";
import { auth } from "@/lib/auth";
import {
  UpdateSiteReportDetailsForm,
  UpdateSiteReportForm,
} from "./edit-forms";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UpdateSiteReportFiles } from "./edit-upload";
import { UpdateSiteReportSections } from "./edit-sections";
import * as Actions from "@/lib/actions";

export default async function Page({
  params,
}: {
  params: { siteId: string; reportId: string };
}) {
  const siteId = Number(params.siteId);
  const reportId = Number(params.reportId);

  const memberRole = await Actions.getSiteRole(siteId);
  if (memberRole && ["supervisor", "owner", "manager"].includes(memberRole)) {
    const siteId = Number(params.siteId);
    const reportId = Number(params.reportId);
    return (
      <DefaultLayout>
        <Button asChild>
          <Link href={`/sites/${siteId}/reports/${reportId}`}>
            Back To Report
          </Link>
        </Button>
        <UpdateSiteReportFiles siteId={siteId} reportId={reportId} />
        <UpdateSiteReportForm siteId={siteId} reportId={reportId} />
        <UpdateSiteReportDetailsForm siteId={siteId} reportId={reportId} />
        <UpdateSiteReportSections siteId={siteId} reportId={reportId} />
      </DefaultLayout>
    );
  } else {
    notFound();
  }
}
