import * as Actions from "@/lib/actions";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { siteId: string } }) {
  const session = await auth();
  if (session?.user?.role === "admin") {
    const siteId = Number(params.siteId);
    const report = await Actions.addSiteReport(siteId);
    if (report) redirect(`/sites/${siteId}/reports/${report.id}/edit`);
    return <p>failed to create site report</p>;
  }
  notFound();
}
