import Link from "next/link";
import { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { allowEditAfterPublish, editReportRoles } from "@/lib/permissions";
import * as Actions from "@/lib/actions";

import {
  LucideChevronDown,
  LucideChevronRight,
  LucideFilePlus2,
  LucideMoveLeft,
  LucidePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WarningBox } from "@/components/info-box";
import { Site, SiteReport } from "@/lib/types/site";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export async function ReportListPopup({
  site,
  report,
}: {
  site?: Site;
  report?: SiteReport;
}) {
  if (!site) return <div>invalid site</div>;

  const reports = await Actions.listSiteReports(site.id);
  const noReports = <div className="w-full px-16">No reports</div>;
  if (!reports) return noReports;
  if (reports.length < 1) return noReports;

  return (
    <ScrollArea className="flex flex-col max-h-[60svh] p-0">
      <ol>
        {reports.map((r) => (
          <li key={r.id} className="w-full">
            <Button variant="link" asChild className="w-full px-8 py-5">
              <Link
                href={`/sites/${site.id}/reports/${r.id}`}
                className={cn(
                  "flex gap-4 w-full text-xl",
                  report && report.id === r.id
                    ? "pointer-events-none opacity-50"
                    : "",
                )}
              >
                <span className="grow">
                  {`Site Report #${r.id} - ${r.createdAt?.toDateString() || "unknown date"}`}
                </span>
                <span>{!r.publishedAt && "(unpublished)"}</span>
                <LucideChevronRight className="" />
              </Link>
            </Button>
          </li>
        ))}
      </ol>
    </ScrollArea>
  );
}

export async function ReportTitleBarDisplay({
  session,
  site,
  report,
}: {
  session?: Session | null;
  site?: Site;
  report?: SiteReport;
}) {
  const memberRole = site ? await Actions.getSiteRole(site.id) : "";
  return (
    <div className="grow flex flex-col sm:flex-row gap-2">
      <div>
        <Button variant="secondary" asChild>
          <Link
            href={`/sites/${site?.id ?? ""}`}
            className="flex gap-2 w-full h-full items-center"
          >
            <LucideMoveLeft className="h-5" />
            Back to Project
          </Link>
        </Button>
      </div>

      <div className="grow flex w-full sm:w-fit">
        <Popover>
          <PopoverTrigger asChild disabled={!report}>
            <Button
              variant="secondary"
              className="items-center gap-4 border-2 rounded border-primary"
            >
              <h1 className="text-xl sm:text-2xl font-semibold grow text-start">
                {report
                  ? `Site Report #${report.id} - ${report.createdAt?.toDateString()}`
                  : "This site has no reports yet"}
              </h1>
              <LucideChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="px-0 py-4 w-full rounded border-2 border-primary shadow-xl"
            align="center"
            side="bottom"
            sideOffset={12}
            sticky="always"
            avoidCollisions={false}
          >
            <ReportListPopup site={site} report={report} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="">
        {site &&
          session &&
          session.user &&
          memberRole &&
          editReportRoles.includes(memberRole) && (
            <div className="grid grid-cols-2 w-full sm:w-fit sm:flex gap-4">
              {report &&
                (!report.publishedAt || allowEditAfterPublish ? (
                  <Button variant="secondary" asChild>
                    <Link
                      href={`/sites/${site.id}/reports/${report.id}/edit`}
                      className="flex gap-2"
                    >
                      Edit Report <LucidePen className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                ) : (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          className="flex gap-2 opacity-50"
                        >
                          Edit Report <LucidePen className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={10}
                        align="end"
                        className="p-0 bg-transparent"
                      >
                        <WarningBox>
                          This report has already been published and can no
                          longer be edited.
                        </WarningBox>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}

              <Button asChild className="gap-2">
                <Link href={`/sites/${site.id}/reports/new`}>
                  New Report <LucideFilePlus2 className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}

export async function ReportTitleBar({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId?: number;
  fileId?: number;
}) {
  const session = await auth();
  const [site, report] = await Promise.all([
    Actions.getSiteDetails(siteId),
    reportId ? Actions.getSiteReport(reportId) : undefined,
  ]);
  const props = { session, site, report };
  return <ReportTitleBarDisplay {...props} />;
}

export async function ReportTitleBarNull() {
  return <ReportTitleBarDisplay />;
}
