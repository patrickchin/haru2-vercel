import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteDetails, SiteMember, SiteMemberRole } from "@/lib/types";
import * as Actions from "@/lib/actions";

import SiteCalendar from "./site-calendar";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideArrowRight } from "lucide-react";
import EditSiteMembersButtonPopup from "./site-members-add";

interface SiteDetailsProps {
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
          <span className="font-semibold capitalize">{country || "<unknown>"}</span>
        </li>
        <li>
          <span>Type: </span>
          <span className="font-semibold">{site.type || "<unknown>"}</span>
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

function SiteMembersBar({ site, members }: SiteDetailsProps) {
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
      <EditSiteMembersButtonPopup />
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

  const membersDialogOpen = searchParams["m"] === "1";
  console.log(membersDialogOpen);

  // TODO custom site not found page
  if (!site) notFound();

  return (
    <div className="flex flex-col min-h-screen items-center">
      <Header />

      {/* <main className="grow flex flex-col px-16 py-8 gap-4"> */}
      <main className="grow flex flex-col gap-4 max-w-6xl w-full px-16 py-8 w-full">
        <div className="flex justify-between">
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
            <CardHeader>Supervision Progress and Milestones</CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Progress value={20} />
              <p>Start date: xxxx </p>
              <p>End date: xxxx </p>
              <p>Number of reports: xxxx </p>
              <p>Next upcoming report date: xxx </p>
            </CardContent>
          </Card>
        </div>

        <SiteDescription site={site} members={members} />
      </main>

      <Footer />
    </div>
  );
}
