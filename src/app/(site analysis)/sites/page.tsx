import Link from "next/link";
import * as Actions from "@/lib/actions";

import { LucideArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DefaultLayout } from "@/components/page-layouts";
import { SiteAndExtra } from "@/lib/types";

function EmptySitesList() {
  return <p>You currently do not have any sites registered with us</p>;
}

async function SiteItem({ site }: { site?: SiteAndExtra }) {
  // const members = await Actions.getSiteMembers(site.id);
  // const reports = await Actions.getSiteReports(site.id);
  if (!site) return <div>Invalid Site Project</div>;
  return (
    <Link
      href={`/sites/${site.id}`}
      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border hover:bg-accent bg-background"
    >
      <div className="grow flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col">
          <h2 className="whitespace-nowrap overflow-ellipsis font-semibold text-lg">
            Site {site.id}: {site.title}
          </h2>
          <p>
            You are a{" "}
            <span className="capitalize font-semibold">{site.myRole}</span> of
            this site.
          </p>
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
      <h1 className="text-3xl font-semibold">My Site Supervision Projects</h1>

      <div>
        <Button asChild>
          <Link href="/sites/new">Register New Construction Site</Link>
        </Button>
      </div>

      <SitesList />
    </DefaultLayout>
  );
}
