import * as Actions from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);
  const report = await Actions.addSiteReport(siteId);
  if (report)
    redirect(`/sites/${siteId}/reports/${report.id}/edit`);

  return <p>failed to create site report</p>;
}