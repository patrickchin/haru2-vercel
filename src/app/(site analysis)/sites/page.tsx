import Link from "next/link";
import * as Actions from "@/lib/actions";

import { LucideArrowRight, LucidePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DefaultLayout } from "@/components/page-layouts";
import { SiteAndExtra } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { InfoBox } from "@/components/info-box";

function EmptySitesList() {
  return <p>You currently do not have any sites registered with us</p>;
}

async function SiteItem({ site }: { site?: SiteAndExtra }) {
  // const members = await Actions.getSiteMembers(site.id);
  // const reports = await Actions.getSiteReports(site.id);
  if (!site) return <div>Invalid Site Project</div>;
  return (
    <Card className="hover:bg-accent ">
      <Link
        href={`/sites/${site.id}`}
        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4"
      >
        <div className="grow flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col">
            <h2 className="whitespace-nowrap overflow-ellipsis font-semibold text-lg">
              Site {site.id}: {site.title}
            </h2>
            {site.myRole ? (
              <p>
                You are a{" "}
                <span className="capitalize font-semibold">{site.myRole}</span>{" "}
                of this site.
              </p>
            ) : (
              <p>You are not a member of this site.</p>
            )}
          </div>
          {site.lastReportDate ? (
            <p>
              Last report published{" "}
              <span className="font-semibold">
                {site.lastReportDate.toDateString()}
              </span>
            </p>
          ) : (
            <p>No reports published</p>
          )}
        </div>
        <Button variant="secondary">
          <LucideArrowRight className="w-3.5" />
        </Button>
      </Link>
    </Card>
  );
}

async function SitesList() {
  const sites = await Actions.getAllVisibleSites();

  if (!sites || sites.length <= 0) {
    return <EmptySitesList />;
  }

  return (
    <ol className="min-w-96 flex flex-col gap-4">
      {sites?.map((site, i) => {
        return (
          <li key={i}>
            <SiteItem site={site} />
          </li>
        );
      })}
    </ol>
  );
}

export default async function Page() {
  return (
    <DefaultLayout>
      <div className="flex items-center">
        <h1 className="grow text-3xl font-semibold">
          Site Supervision Projects
        </h1>
        <Button asChild>
          <Link href="/sites/new">
            Register New Construction Site
            <LucidePlus />
          </Link>
        </Button>
      </div>

      <InfoBox className="whitespace-pre-line text-base font-normal leading-7 max-w-3xl mx-auto">
        <ul className="list-inside list-disc">
          <li>
            All site projects you&apos;ve created, or site projects that you are a
            member of, will appear here.
          </li>
          <li>
            If you are the owner of a site that needs supervision, please first
            register your site.
          </li>
          <li>
            If you are a contractor or supervisor, please ask the site owner to
            make you a member of the site project and it will appear in the list
            below.
          </li>
        </ul>
      </InfoBox>

      <SitesList />
    </DefaultLayout>
  );
}
