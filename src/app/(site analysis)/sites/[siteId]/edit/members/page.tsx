import { notFound } from "next/navigation";
import * as Actions from "@/lib/actions";

import { LucideArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DefaultLayout } from "@/components/page-layouts";
import { EditSiteMembersForm } from "../../edit-key-members";
import Link from "next/link";

export default async function Page(props: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const siteId = Number((await props.params).siteId);
  const [site] = await Promise.all([Actions.getSiteDetails(siteId)]);

  if (!site) notFound();

  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Fill in your Team&apos;s Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <EditSiteMembersForm site={site} continueAndRedirect={true} />
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
