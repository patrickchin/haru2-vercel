import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteDetails, SiteMember, SiteMemberRole } from "@/lib/types";
import { editSiteRoles } from "@/lib/permissions";
import * as Actions from "@/lib/actions";

import {
  LucideAlertTriangle,
  LucideCheck,
  LucideEdit,
  LucideMoveLeft,
  LucideMoveRight,
} from "lucide-react";

import SiteMeetings from "./site-meetings";
import SiteMembers from "./site-members";
import { EditSiteSchedule } from "./edit-schedule";
import { EditKeySiteMembers } from "./edit-key-members";
import { EditSiteTitle } from "./edit-title";
import { EditSiteDescription } from "./edit-description";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DefaultLayout } from "@/components/page-layouts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoodBox, InfoBox, WarningBox } from "@/components/info-box";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import CommentsSection from "@/components/comments-section";

function SiteDescription({
  site,
  members,
  role,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
  role: SiteMemberRole;
}) {
  const desc =
    site.description ??
    "There is currently no description for this site project";
  return (
    <Card id="description">
      <CardHeader className="flex flex-row font-semibold py-0 items-center">
        <span className="grow py-6">Description</span>
        {editSiteRoles.includes(role) && <EditSiteDescription site={site} />}
      </CardHeader>
      <CardContent>
        <div className="bg-muted border rounded p-4 whitespace-pre-line">
          {desc}
        </div>
      </CardContent>
    </Card>
  );
}

function SiteInfoBar({
  site,
  members,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}) {
  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);
  const country = site.countryCode
    ? displayNames.of(site.countryCode)
    : undefined;

  return (
    <Card className="flex flex-col gap-4 px-6">
      <ul className="flex flex-col sm:flex-row sm:inline-flex">
        <li className="hover:bg-accent py-4 px-4 space-x-1">
          <span className="font-semibold">Project Id: </span>
          <span className="">{site.id}</span>
        </li>
        <li className="hover:bg-accent py-4 px-4 space-x-1">
          <span className="font-semibold">Country: </span>
          <span className="">{country || "Unknown"}</span>
        </li>
        <li className="hover:bg-accent py-4 px-4 space-x-1">
          <span className="font-semibold">Type: </span>
          <span className="">{site.type || "Unknown"}</span>
        </li>
        <li className="hover:bg-accent py-4 px-4 space-x-1">
          <span className="font-semibold">Created: </span>
          <span className="">
            {site.createdAt?.toDateString() || "Unknown"}
          </span>
        </li>
      </ul>
    </Card>
  );
}

function SiteMembersBar({
  site,
  members,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}) {
  const owner = members?.find((m) => m.role === "owner");

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center gap-5 p-6">
      <ul className="grow flex flex-col sm:flex-row gap-0 sm:gap-8 max-w-full">
        <li className="min-w-32">
          <p className="font-semibold text-sm">Owner:</p>
          <p className="text-nowrap overflow-ellipsis">
            {owner?.name.length ? owner.name : "-"}
          </p>
        </li>
        <li className="min-w-32">
          <p className="font-semibold text-sm">Project Manager: </p>
          <p className="text-nowrap overflow-ellipsis">
            {site.managerName?.length ? site.managerName : "-"}
          </p>
        </li>
        <li className="min-w-32">
          <p className="font-semibold text-sm">Contractor: </p>
          <p className="text-nowrap overflow-ellipsis">
            {site.contractorName?.length ? site.contractorName : "-"}
          </p>
        </li>
        <li className="min-w-32">
          <p className="font-semibold text-sm">Supervisor: </p>
          <p className="text-nowrap overflow-ellipsis">
            {site.supervisorName?.length ? site.supervisorName : "-"}
          </p>
        </li>
      </ul>

      <EditKeySiteMembers
        site={site}
        members={members}
        dialogName="editMembersBar"
      />
    </Card>
  );
}

function SiteMembersTable({
  site,
  members,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}) {
  const owner = members?.find((m) => m.role === "owner");

  return (
    <Card id="members">
      <CardHeader className="font-semibold flex flex-row justify-between items-center py-0">
        <span className="py-6">Key Project Member Details</span>
        <EditKeySiteMembers
          site={site}
          members={members}
          dialogName="editMembers"
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48"></TableHead>
              <TableHead className="w-48">Name</TableHead>
              <TableHead className="w-48">Email</TableHead>
              <TableHead className="w-48">Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead className="font-medium">Owner</TableHead>
              <TableCell>{site.ownerName}</TableCell>
              <TableCell>{site.ownerEmail}</TableCell>
              <TableCell>{site.ownerPhone}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Project Manager</TableHead>
              <TableCell>{site.managerName}</TableCell>
              <TableCell>{site.managerEmail}</TableCell>
              <TableCell>{site.managerPhone}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Contractor</TableHead>
              <TableCell>{site.contractorName}</TableCell>
              <TableCell>{site.contractorEmail}</TableCell>
              <TableCell>{site.contractorPhone}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Supervisor</TableHead>
              <TableCell>{site.supervisorName}</TableCell>
              <TableCell>{site.supervisorEmail}</TableCell>
              <TableCell>{site.supervisorPhone}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

async function SiteComplaints({
  site,
  role,
}: {
  site: SiteDetails;
  role?: SiteMemberRole;
}) {
  const complaints = await Actions.getSiteNotices(site.id);
  const resolved = complaints?.filter((c) => c.resolved);
  const unresolved = complaints?.filter((c) => !c.resolved);

  return (
    <Card id="meetings">
      <CardHeader className="flex flex-row justify-between items-center py-0 space-y-0">
        <CardTitle className="font-semibold text-base py-6">
          Current Unresolved Issues as Site
        </CardTitle>
        {role && editSiteRoles.includes(role) && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button variant="outline" disabled>
                    Edit <LucideEdit />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent asChild>
                <WarningBox>Coming Soon</WarningBox>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      <CardContent>
        {unresolved && unresolved.length > 0 ? (
          <Table>
            <TableBody>
              {unresolved.map((c) => (
                <TableRow className="" key={`notice-${c.id}`}>
                  <TableCell className="align-top" width={1}>
                    <LucideAlertTriangle className="text-destructive" />
                  </TableCell>
                  <TableCell className={c.resolved ? "line-through" : ""}>
                    {c.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <>
            <GoodBox>Currently there are no unresolved issues!</GoodBox>
          </>
        )}
        {resolved && resolved.length > 0 && (
          <Table>
            <TableBody>
              {resolved?.map((c) => (
                <TableRow className={"opacity-60"} key={`notice-${c.id}`}>
                  <TableCell className="" width={1}>
                    <LucideCheck className="text-green-600" />
                  </TableCell>
                  <TableCell className={c.resolved ? "line-through" : ""}>
                    {c.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function SiteProgress({
  site,
  role,
}: {
  site: SiteDetails;
  role?: SiteMemberRole;
}) {
  const progressPct =
    site.startDate && site.endDate
      ? (100 * (new Date().getTime() - site.startDate.getTime())) /
        (site.endDate.getTime() - site.startDate.getTime())
      : undefined;

  return (
    <Card id="progress">
      <CardHeader className="flex flex-row justify-between items-center py-0 space-y-0">
        <CardTitle className="font-semibold text-base py-6">
          Supervision Schedule
        </CardTitle>
        {role && editSiteRoles.includes(role) && (
          <EditSiteSchedule site={site} />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!site.startDate && (
          <InfoBox>
            After scheduling a meeting with us in the section below, we will
            update the site supervision schedule dates here.
          </InfoBox>
        )}
        <Progress value={progressPct} indicatorClassName="bg-blue-400" />
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="font-medium">Creation Date</TableHead>
              <TableCell>
                {site.createdAt?.toDateString() || "Unknown"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Start Date</TableHead>
              <TableCell>
                {site.startDate?.toDateString() ?? "Unknown"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">End Date</TableHead>
              <TableCell>{site.endDate?.toDateString() ?? "Unknown"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Next Report Date</TableHead>
              <TableCell>
                {site.nextReportDate?.toDateString() ?? "Unknown"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Report Schedule</TableHead>
              <TableCell>{site.schedule ?? "Unknown"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default async function Page(props: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const siteId = Number((await props.params).siteId);
  const [site, members, role, commentsSectionId] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.getSiteMembers(siteId),
    Actions.getSiteMemberRole({ siteId }),
    Actions.getSiteCommentsSection(siteId),
  ]);

  // TODO custom site not found page
  if (!site) notFound();

  return (
    <DefaultLayout>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center pb-3">
        <Button variant="secondary" asChild>
          <Link href={`/sites`} className="flex items-center gap-2">
            <LucideMoveLeft />
            Back to Site List
          </Link>
        </Button>

        {editSiteRoles.includes(role) ? (
          <EditSiteTitle site={site} />
        ) : (
          <div className="grow flex gap-4">
            <h1 className="text-2xl font-semibold">
              Site {site.id}: {site?.title}
            </h1>
          </div>
        )}

        <Button variant={"default"} size={"lg"} asChild>
          <Link
            href={`/sites/${siteId}/reports`}
            className="flex items-center gap-2 [&_svg]:size-6"
          >
            Click Here to View Reports
            <LucideMoveRight />
          </Link>
        </Button>
      </div>

      <SiteInfoBar site={site} members={members} />
      <SiteMembersBar site={site} members={members} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <SiteProgress site={site} role={role} />
        <SiteComplaints site={site} role={role} />
      </div>

      <SiteMeetings site={site} members={members} />

      <SiteMembersTable site={site} members={members} />

      <SiteMembers site={site} members={members} />

      <SiteDescription site={site} members={members} role={role} />

      {commentsSectionId && (
        <CommentsSection commentsSectionId={commentsSectionId} />
      )}
    </DefaultLayout>
  );
}
