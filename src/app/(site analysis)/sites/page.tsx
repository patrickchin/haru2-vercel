import Link from "next/link";
import { redirect } from "next/navigation";
import * as Actions from "@/lib/actions";

import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function Page() {
  const sites = await Actions.getMySites();

  if (!sites) {
    redirect("/");
  }

  if (sites?.length === 1) {
    redirect(`/site/${sites[0].id}`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center px-16 py-8 gap-4">
        <Button asChild>
          <Link href="/new-site">Register Construction Site</Link>
        </Button>
        <ol>
          {sites.map((site, i) => {
            return (
              <li key={i}>
                <Button asChild variant="outline">
                  <Link href={`/site/${site.id}`}>Site {site.id}</Link>
                </Button>
              </li>
            );
          })}
        </ol>
      </main>

      <Footer />
    </div>
  );
}
