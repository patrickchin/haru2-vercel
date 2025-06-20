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
import { SiteDetails, SiteReport } from "@/lib/types/site";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export async function ReportListPopup({
  site,
  report,
}: {
  site?: SiteDetails;
  report?: SiteReport;
}) {
  if (!site) return <div>invalid site</div>;

  const reports = await Actions.listSiteReports(site.id);
  const noReports = (
    <div className="px-16 py-8 text-muted-foreground text-center">
      No reports
    </div>
  );
  if (!reports) return noReports;
  if (reports.length < 1) return noReports;

  return (
    <ScrollArea className="rounded-lg border">
      <ol className="divide-y">
        {reports.map((r) => (
          <li key={r.id}>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full p-6 flex text-lg font-semibold min-w-0",
                report && report.id === r.id
                  ? "pointer-events-none opacity-60 bg-muted text-muted-foreground"
                  : "hover:bg-primary/5 hover:text-primary",
              )}
            >
              <Link
                href={`/sites/${site.id}/reports/${r.id}`}
                className="flex gap-4 w-full items-center min-w-0"
              >
                <span className="grow min-w-0 truncate text-left">
                  {`#${r.index} - ${r.title || r.createdAt?.toDateString()}`}
                </span>
                <span className="text-sm text-muted-foreground font-normal ml-2 whitespace-nowrap">
                  {!r.publishedAt && "(unpublished)"}
                </span>
                <LucideChevronRight className="ml-2 h-4 w-4 opacity-60 shrink-0" />
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
  site?: SiteDetails;
  report?: SiteReport;
}) {
  const memberRole = site ? await Actions.getSiteRole(site.id) : "";
  return (
    <div className="grow flex flex-col sm:flex-row gap-2">
      <div>
        <Button variant="secondary" asChild>
          <Link
            href={`/sites/${site?.id ?? ""}?tab=reports`}
            className="flex gap-2 items-center"
          >
            <LucideMoveLeft className="h-5" />
            Back to Project
          </Link>
        </Button>
      </div>

      <div className="grow flex flex-col min-w-0">
        <Dialog>
          <DialogTrigger asChild disabled={!report}>
            <Button
              variant="secondary"
              className="items-center gap-4 border-2 rounded border-primary w-full"
            >
              <h1 className="text-xl sm:text-2xl font-semibold grow text-start truncate overflow-hidden text-ellipsis min-w-0 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
                {report
                  ? `#${report.index} - ${report.title || report.createdAt?.toDateString()}`
                  : "This site has no reports yet"}
              </h1>
              <LucideChevronDown />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full">
            <DialogTitle>Select a Report</DialogTitle>
            <ReportListPopup site={site} report={report} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="">
        {site &&
          session &&
          session.user &&
          memberRole &&
          editReportRoles.includes(memberRole) && (
            <div className="grid grid-cols-2 sm:w-fit sm:flex gap-4">
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
