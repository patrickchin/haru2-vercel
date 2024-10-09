import { DefaultLayout } from "@/components/page-layouts";
import { auth } from "@/lib/auth";
import {
  UpdateSiteReportDetailsForm,
  UpdateSiteReportForm,
} from "./edit-forms";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadAndManageFiles } from "./edit-upload";
import { UpdateSiteReportSections } from "./edit-sections";
import { EditReportDocument } from "./edit-report-document";

interface EditReportPageProps {
  params: {
    siteId?: number;
    reportId?: number;
  };
}

export default async function Page({ params }: EditReportPageProps) {
  const siteId = Number(params.siteId);
  const reportId = Number(params.reportId);

  const session = await auth();
  if (session?.user?.role === "admin" || session?.user?.role === "supervisor") {
    return (
      <DefaultLayout>
        <UploadAndManageFiles reportId={reportId ?? 11} />
        <EditReportDocument siteId={siteId} reportId={reportId} sections={[]} />
      </DefaultLayout>
    );
  } else {
    notFound();
  }
}
