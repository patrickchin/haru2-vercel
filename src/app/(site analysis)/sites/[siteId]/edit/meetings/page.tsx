import { DefaultLayout } from "@/components/page-layouts";
import { notFound } from "next/navigation";
import * as Actions from "@/lib/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteMeetingsFormAndTable } from "../../site-meetings";
import { Button } from "@/components/ui/button";
import { LucideArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Page(props: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const siteId = Number((await props.params).siteId);
  const [site, role] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.getSiteRole(siteId),
  ]);

  if (!site || !role) notFound();

  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Schedule a Meeting with Us</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="space-y-2">
            <p>
              Schedule your prefered time and dates for a call with us where we
              will organise a site supervisor for this site project.
            </p>
            <p>We will confirm the meeting time by email and SMS.</p>
          </div>
          <SiteMeetingsFormAndTable site={site} role={role} />
          <div className="text-end">
            <Button asChild>
              <Link href={`/sites/${site.id}`}>
                Continue <LucideArrowRight />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
