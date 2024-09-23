import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteDetails, SiteMember, SiteMemberRole } from "@/lib/types";
import * as Actions from "@/lib/actions";
import {
  LucideArrowRight,
  LucideCheck,
  LucideTrash,
  LucideX,
} from "lucide-react";

import SiteCalendarForm from "./site-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import EditSiteMembersButtonPopup from "./site-members-add";

export interface SiteDetailsProps {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}

function SiteDescription({ site, members }: SiteDetailsProps) {
  const desc =
    site.description ??
    "There is currently no description for this site project";
  return (
    <Card>
      <CardHeader>Description</CardHeader>
      <CardContent>{desc}</CardContent>
    </Card>
  );
}

function SiteInfoBar({ site, members }: SiteDetailsProps) {
  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);
  const country = site.countryCode
    ? displayNames.of(site.countryCode)
    : undefined;

  return (
    <Card className="flex flex-col gap-4 px-6">
      <ul className="inline-flex">
        <li className="hover:bg-accent py-4 px-8 space-x-1">
          <span className="font-semibold">Project Id: </span>
          <span className="">{site.id}</span>
        </li>
        <li className="hover:bg-accent py-4 px-8 space-x-1">
          <span className="font-semibold">Country: </span>
          <span className="">{country || "Unknown"}</span>
        </li>
        <li className="hover:bg-accent py-4 px-8 space-x-1">
          <span className="font-semibold">Type: </span>
          <span className="">{site.type || "Unknown"}</span>
        </li>
        <li className="hover:bg-accent py-4 px-8 space-x-1">
          <span className="font-semibold">Created: </span>
          <span className="">{site.createdAt.toDateString()}</span>
        </li>
      </ul>
    </Card>
  );
}

function SiteMembersBar2({ site, members }: SiteDetailsProps) {
  const keyMemberRoles: SiteMemberRole[] = [
    "owner",
    "manager",
    "contractor",
    "supervisor",
  ];
  const membersByRole: { [k: string]: SiteMember[] } = Object.fromEntries(
    keyMemberRoles.map((r) => [
      r,
      (members?.filter((m) => m.role === r) ?? []) as SiteMember[],
    ]),
  );

  return (
    <Card className="flex items-center gap-3 p-4 px-6">
      <ul className="grow inline-flex gap-4">
        {Object.entries(membersByRole).map(([role, mems]) => {
          if (mems.length === 0) {
            return (
              <li key={`${role}-0`}>
                <span className="font-semibold capitalize">{role}: </span>
                <span className="">{"<unknown>"}</span>
              </li>
            );
          } else {
            return mems.map((mem, i) => (
              <li key={`${role}-${i}`}>
                <span className="font-semibold capitalize">{role}: </span>
                <span className="">{mem?.name ?? "<unknown>"}</span>
              </li>
            ));
          }
        })}
      </ul>
      <EditSiteMembersButtonPopup site={site} members={members} />
    </Card>
  );
}

function SiteMembersBar({ site, members }: SiteDetailsProps) {
  const owner = members?.find((m) => m.role === "owner");

  return (
    <Card className="flex items-center gap-5 px-6">
      <ul className="grow flex max-w-full">
        <li className="hover:bg-accent py-4 px-4">
          <p className="font-semibold text-sm">Owner:</p>
          <p className="text-nowrap">{owner?.name.length ? owner.name : "-"}</p>
        </li>
        <li className="hover:bg-accent py-4 px-8">
          <p className="font-semibold text-sm">Manager: </p>
          <p className="text-nowrap">
            {site.managerName?.length ? site.managerName : "-"}
          </p>
        </li>
        <li className="hover:bg-accent py-4 px-8">
          <p className="font-semibold text-sm">Contractor: </p>
          <p className="text-nowrap">
            {site.contractorName?.length ? site.contractorName : "-"}
          </p>
        </li>
        <li className="hover:bg-accent py-4 px-8">
          <p className="font-semibold text-sm">Supervisor: </p>
          <p className="text-nowrap">
            {site.supervisorName?.length ? site.supervisorName : "-"}
          </p>
        </li>
      </ul>
      <EditSiteMembersButtonPopup site={site} members={members} />
    </Card>
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { siteId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const siteId = Number(params.siteId);
  const [site, members] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.getSiteMembers(siteId),
  ]);

  // TODO custom site not found page
  if (!site) notFound();

  const progressPct =
    site.startDate && site.endDate
      ? (new Date().getTime() - site.startDate.getTime()) /
        (site.endDate.getTime() - site.startDate.getTime())
      : undefined;

  return (
    <DefaultLayout>
      <div className="flex items-center justify-between pb-3">
        <h3>
          Site {siteId}: {site?.title}
        </h3>
        <Button variant={"default"} size={"lg"} asChild>
          <Link
            href={`/sites/${siteId}/reports`}
            className="flex items-center gap-2"
          >
            Click Here to View Reports
            <LucideArrowRight />
          </Link>
        </Button>
      </div>

      <SiteInfoBar site={site} members={members} />
      <SiteMembersBar site={site} members={members} />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="font-semibold">
            Schedule a Zoom Meeting with the Team
          </CardHeader>
          <CardContent className="">
            <SiteCalendarForm />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Suggested Time</TableHead>
                  <TableHead>Agreed/Pending</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(2)
                  .fill(0)
                  .map((x, i) => (
                    <TableRow key={i}>
                      <TableCell>{site.createdAt.toLocaleString()}</TableCell>
                      <TableCell>Pending ...</TableCell>
                      <TableCell className="flex gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 p-1"
                        >
                          <LucideTrash className="w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 p-1"
                        >
                          <LucideX className="w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 p-1"
                        >
                          <LucideCheck className="w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="font-semibold">
            Supervision Progress and Milestones
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Progress value={progressPct} />

            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="font-medium">Creation</TableHead>
                  <TableCell>{site.createdAt.toDateString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-medium">Start</TableHead>
                  <TableCell>
                    {site.startDate?.toDateString() ??
                      "Site supervision has not yet started"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-medium">End</TableHead>
                  <TableCell>
                    {site.endDate?.toDateString() ??
                      "End date has not yet been agreed upon"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-medium">Next</TableHead>
                  <TableCell>
                    {site.nextReportDate?.toDateString() ??
                      "Next report date has not been set"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-medium">Schedule</TableHead>
                  <TableCell>
                    {site.schedule ??
                      "A report schedule has not yet been agreed on"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <SiteDescription site={site} members={members} />
    </DefaultLayout>
  );
}
