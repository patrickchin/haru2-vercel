import { DefaultLayout } from "@/components/page-layouts";
import { notFound } from "next/navigation";
import * as Actions from "@/lib/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideMoveRight } from "lucide-react";

function ProjectTypeSelection({ siteId }: { siteId: number }) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <Button
        variant="outline"
        className={cn(
          "flex flex-col",
          "h-72 text-lg font-normal",
          "bg-gradient-to-r from-sky-400/35 to-indigo-300/35 hover:to-sky-400/35",
          "[&_svg]:size-7",
        )}
        asChild
      >
        <Link href={`/sites/${siteId}/edit/meetings`}>
          <span>Hire our Supervisors</span>
          <span className="text-sm text-muted-foreground">
            Schedule a meeting with us
          </span>
          <LucideMoveRight />
        </Link>
      </Button>
      <Button
        variant="outline"
        className={cn(
          "flex flex-col",
          "h-72 text-lg font-normal",
          "bg-gradient-to-l from-green-400/35 to-teal-200/35 hover:to-green-400/35",
          "[&_svg]:size-7",
        )}
        asChild
      >
        <Link href={`/sites/${siteId}/edit/members`}>
          <span>Setup my own Team</span>
          <span className="text-sm text-muted-foreground">
            Fill in your details and start reporting
          </span>
          <LucideMoveRight />
        </Link>
      </Button>
    </div>
  );
}

export default async function Page(props: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const siteId = Number((await props.params).siteId);
  const [site, role] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.getSiteRole(siteId),
  ]);

  if (!site || !role) notFound();

  return (
    <DefaultLayout className="max-w-4xl">
      <Card className="overflow-hidden">
        <CardHeader className="bg-green-200">
          <div>Site Created Successfully</div>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="p-6 flex flex-col gap-6">
          <CardTitle className="font-medium">
            Do you already have a supervisor?
          </CardTitle>
          <ProjectTypeSelection siteId={siteId} />
          <div className="text-end">
            <Button variant="secondary" asChild>
              <Link href={`/sites/${siteId}`}>
                Skip <LucideMoveRight />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
