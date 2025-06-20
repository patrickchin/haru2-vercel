import Link from "next/link";
import * as Actions from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, LucidePlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteReport } from "@/lib/types";

export async function SiteReportsList({ siteId }: { siteId: number }) {
  const reports = await Actions.listSiteReports(siteId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Site Reports</CardTitle>
        <Button asChild variant="secondary">
          <Link href={`/sites/${siteId}/reports/new`}>
            <LucidePlus /> New Report
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {reports && reports.length > 0 ? (
          <ul className="border rounded overflow-hidden">
            {reports.map((report: SiteReport) => (
              <li
                key={report.id}
                className="flex flex-col sm:flex-row gap-4 p-4 sm:items-center justify-end [&:not(:last-child)]:border-b"
              >
                <div className="flex flex-row flex-wrap grow gap-4">
                  <div className="grow">
                    <Link
                      href={`/sites/${siteId}/reports/${report.id}`}
                      className="font-semibold hover:underline"
                    >
                      Report #{report.id}
                      {report.title ? `: ${report.title}` : ""}
                    </Link>
                    {report.reporter && (
                      <div className="text-sm text-muted-foreground">
                        by {report.reporter.name}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground text-end">
                    {report.createdAt && (
                      <div>Created: {report.createdAt.toDateString()}</div>
                    )}
                    {report.publishedAt ? (
                      <div>Published: {report.publishedAt.toDateString()}</div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-end">
                  <Button asChild variant="outline">
                    <Link href={`/sites/${siteId}/reports/${report.id}/edit`}>
                      <Pencil /> Edit
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/sites/${siteId}/reports/${report.id}`}>
                      <Eye /> View
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground">
            No reports found for this site.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
