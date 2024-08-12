import { Button } from "@/components/ui/button";
import * as Actions from "@/lib/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const sites = await Actions.getUserSites();

  if (!sites) {
    redirect("/");
  }

  if (sites?.length === 1) {
    redirect(`/site/${sites[0].id}`);
  }

  return (
    <>
      <form action={Actions.addUserSite}>
        <Button>Register Construction Site</Button>
      </form>
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
    </>
  );
}
