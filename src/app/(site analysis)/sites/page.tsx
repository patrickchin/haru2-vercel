import Link from "next/link";
import * as Actions from "@/lib/actions";

import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { LucideArrowRight } from "lucide-react";

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
              href={`/site/${site.id}`}
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col items-center px-16 py-8 gap-8">
        <h2>My Site Supervision Projects</h2>
        <Button asChild>
          <Link href="/new-site">Register New Construction Site</Link>
        </Button>
        <SitesList />
      </main>
      <Footer />
    </div>
  );
}
