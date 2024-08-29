import Link from "next/link";
import { redirect } from "next/navigation";
import * as Actions from "@/lib/actions";

import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Header from "@/components/header";

function EmptySitesList() {
  return <p>You currently do not have any sites registered with us</p>;
}

async function SitesList() {
  const sites = await Actions.getMySites();

  if (!sites || sites.length <= 0) {
    return <EmptySitesList />;
  }

  return (
    <ol>
      {sites?.map((site, i) => {
        return (
          <li key={i}>
            <Button asChild variant="outline">
              <Link href={`/site/${site.id}`}>Site {site.id}</Link>
            </Button>
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

      <main className="grow flex flex-col items-center px-16 py-8 gap-4">
        <Button asChild>
          <Link href="/new-site">Register New Construction Site</Link>
        </Button>
        <SitesList />
      </main>

      <Footer />
    </div>
  );
}
