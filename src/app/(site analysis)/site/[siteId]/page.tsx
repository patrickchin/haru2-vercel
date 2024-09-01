import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteDetails, SiteMember, SiteMemberRole } from "@/lib/types";
import * as Actions from "@/lib/actions";
import { LucideArrowRight } from "lucide-react";

import SiteCalendar from "./site-calendar";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import EditSiteMembersButtonPopup from "./site-members-add";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"


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
    <Card className="flex flex-col gap-4 p-4">
      <ul className="inline-flex gap-4">
        <li>
          <span>Project Id: </span>
          <span className="font-semibold">{site.id}</span>
        </li>
        <li>
          <span>Country: </span>
          <span className="font-semibold uppercase">
            {country || "<unknown>"}
          </span>
        </li>
        <li>
          <span>Type: </span>
          <span className="font-semibold capitalize">
            {site.type || "<unknown>"}
          </span>
        </li>
        <li>
          <span>Created: </span>
          <span className="font-semibold">
            {site.createdAt?.toDateString() || "<unknown>"}
          </span>
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
                <span className="capitalize">{role}: </span>
                <span className="font-semibold">{"<unknown>"}</span>
              </li>
            );
          } else {
            return mems.map((mem, i) => (
              <li key={`${role}-${i}`}>
                <span className="capitalize">{role}: </span>
                <span className="font-semibold">
                  {mem?.name ?? "<unknown>"}
                </span>
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
    <Card className="flex items-center gap-3 p-4 px-6">
      <ul className="grow inline-flex gap-4">
        <li>
          <span>Owner: </span>
          <span className="font-semibold">{owner?.name ?? "<unknown>"}</span>
        </li>
        <li>
          <span>Manager: </span>
          <span className="font-semibold">
            {site.managerName ?? "<unknown>"}
          </span>
        </li>
        <li>
          <span>Contractor: </span>
          <span className="font-semibold">
            {site.contractorName ?? "<unknown>"}
          </span>
        </li>
        <li>
          <span>Supervisor: </span>
          <span className="font-semibold">
            {site.supervisorName ?? "<unknown>"}
          </span>
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
    Actions.getSite(siteId),
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
    <div className="flex flex-col min-h-screen items-center">
      <Header />

      {/* <main className="grow flex flex-col px-16 py-8 gap-4"> */}
      <main className="grow flex flex-col gap-4 max-w-6xl w-full px-16 py-8">
        <div className="flex justify-between pb-3">
          <h3>
            Site {siteId}: {site?.title}
          </h3>
          <Button variant={"default"} size={"lg"}>
            <Link href={`/site/${siteId}/reports`}>
              Click Here to View Reports
            </Link>
            <LucideArrowRight />
          </Button>
        </div>

        <SiteInfoBar site={site} members={members} />
        <SiteMembersBar site={site} members={members} />

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>Schedule a Zoom meeting with the Team</CardHeader>
            <CardContent className="flex justify-center">
              <SiteCalendar />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="font-semibold">Supervision Progress and Milestones</CardHeader>
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
                      {site.nextReportDate?.toDateString() ??
                        "A report schedule has not yet been agreed on"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

            </CardContent>
          </Card>
        </div>

        <SiteDescription site={site} members={members} />
      </main>

      <Footer />
    </div>
  );
}
