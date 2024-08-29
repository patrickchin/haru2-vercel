import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteDetails, SiteMember } from "@/lib/types";
import * as Actions from "@/lib/actions";

import SiteCalendar from "./site-calendar";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideArrowRight } from "lucide-react";

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

export function SiteInfoBar({ site, members }: SiteDetailsProps) {
  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);
  const country = site.countryCode
    ? displayNames.of(site.countryCode)
    : undefined;

  const owner = members?.find((m) => m.role === "owner");

  return (
    <Card>
      <CardHeader className="text-sm text-muted-foreground">
        <ul className="inline-block">
          <li className="inline-block border-r px-2">
            <span className="font-bold">Project Id: </span>
            {site.id}
          </li>
          <li className="inline-block border-r px-2">
            <span className="font-bold">Owner: </span>
            {owner?.name || "<unknown>"}
          </li>
          <li className="inline-block border-r px-2">
            <span className="font-bold">Country: </span>
            {country || "<unknown>"}
          </li>
          <li className="inline-block border-r px-2">
            <span className="font-bold">Type: </span>
            {site.type || "<unknown>"}
          </li>
          <li className="inline-block border-none px-2">
            <span className="font-bold">Created: </span>
            {site.createdAt?.toDateString() || "<unknown>"}
          </li>
        </ul>
      </CardHeader>
    </Card>
  );
}

export default async function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);
  const [site, members] = await Promise.all([
    Actions.getSite(siteId),
    Actions.getSiteMembers(siteId),
  ]);

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
