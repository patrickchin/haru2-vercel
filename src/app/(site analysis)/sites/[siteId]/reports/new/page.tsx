import * as Actions from "@/lib/actions";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);
  const memberRole = await Actions.getSiteRole(siteId);
  if (memberRole && ["supervisor", "owner", "manager"].includes(memberRole)) {
    const siteId = Number(params.siteId);
    const report = await Actions.addSiteReport(siteId);
    if (report) redirect(`/sites/${siteId}/reports/${report.id}/edit`);
    return <p>failed to create site report</p>;
  }
  notFound();
}
