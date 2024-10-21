import * as Actions from "@/lib/actions";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const siteId = Number((await params).siteId);
  const memberRole = await Actions.getSiteRole(siteId);
  if (memberRole && ["supervisor", "owner", "manager"].includes(memberRole)) {
    const report = await Actions.addSiteReport(siteId);
    if (report) redirect(`/sites/${siteId}/reports/${report.id}/edit`);
    return <p>failed to create site report</p>;
  }
  notFound();
}
