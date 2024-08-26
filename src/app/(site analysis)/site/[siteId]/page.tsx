import Link from "next/link";
import * as Actions from "@/lib/actions";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { siteId: string } }) {
  const siteId = Number(params.siteId);
  const site = await Actions.getSite(siteId);

  // TODO custom site not found page
  if (!site) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center px-16 py-8 gap-4">
        <h3>
          Site {siteId}: {site?.title}
        </h3>
        <p>
          Some description of the site {JSON.stringify(site.descriptionJson)}
        </p>
        <Button>
          <Link href={`/site/${siteId}/reports`}>
            Click Here to View Reports
          </Link>
        </Button>
      </main>

      <Footer />
    </div>
  );
}
