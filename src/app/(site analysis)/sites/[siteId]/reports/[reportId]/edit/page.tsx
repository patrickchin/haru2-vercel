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
import { EditReportDocument } from "./edit-report-document";

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
        <EditReportDocument
        // Report
        />
      </DefaultLayout>
    );
  } else {
    notFound();
  }
}
