import Link from "next/link";
import * as Actions from "@/lib/actions";

import { LucideArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DefaultLayout } from "@/components/page-layouts";

function EmptySitesList() {
  return <p>You currently do not have any sites registered with us</p>;
}

async function SitesList() {
  const sites = await Actions.getMySites();

  if (!sites || sites.length <= 0) {
    return <EmptySitesList />;
  }

  return (
    <ol className="w-96 flex flex-col gap-4">
      {sites?.map((site, i) => {
        return (
          <li key={i}>
            <Link
              href={`/sites/${site.id}`}
              className="flex items-center gap-3 p-4 border hover:bg-accent"
            >
              <div className="grow flex flex-col">
                <p>
                  Site {site.id}: {site.title}
                </p>
                <p>{site.createdAt?.toDateString()}</p>
              </div>
              <Button variant="secondary">
                <LucideArrowRight className="w-3.5" />
              </Button>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default async function Page() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold">My Site Supervision Projects</h1>
        <Button asChild>
          <Link href="/new-site">Register New Construction Site</Link>
        </Button>
        <SitesList />
      </div>
    </DefaultLayout>
  );
}
