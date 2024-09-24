import { DefaultLayout } from "@/components/page-layouts";
import { auth } from "@/lib/auth";
import {
  UpdateSiteReportDetailsForm,
  UpdateSiteReportForm,
} from "./edit-forms";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({
  params,
}: {
  params: { siteId: string; reportId: string };
}) {
  const siteId = Number(params.siteId);
  const reportId = Number(params.reportId);

  const session = await auth();
  if (session?.user?.role === "admin" || session?.user?.role === "supervisor") {
    const siteId = Number(params.siteId);
    const reportId = Number(params.reportId);
    return (
      <DefaultLayout>
        <Button asChild>
        <Link href={`/sites/${siteId}/reports/${reportId}`}>
          Back To Report
        </Link>
        </Button>
        <UpdateSiteReportForm siteId={siteId} reportId={reportId} />
        <UpdateSiteReportDetailsForm siteId={siteId} reportId={reportId} />
      </DefaultLayout>
    );
  } else {
    notFound();
  }
}
