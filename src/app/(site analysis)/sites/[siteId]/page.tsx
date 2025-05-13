import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteDetails, SiteMember, SiteMemberRole } from "@/lib/types";
import { editSiteRoles } from "@/lib/permissions";
import * as Actions from "@/lib/actions";

import {
  LucideAlertTriangle,
  LucideBookUser,
  LucideCheck,
  LucideEdit,
  LucideMoveLeft,
  LucideMoveRight,
} from "lucide-react";

import SiteMembers from "./site-members";
import { EditSiteSchedule } from "./edit-schedule";
import { EditKeySiteMembers } from "./edit-key-members";
import { EditSiteTitle } from "./edit-title";
import { EditSiteDescription } from "./edit-description";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DefaultLayout } from "@/components/page-layouts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoodBox, InfoBox, WarningBox } from "@/components/info-box";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CommentsSection from "@/components/comments-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TabsTriggerSearchParams } from "@/components/tabs-trigger-search-params";
import { getRoleName } from "@/lib/constants";
import { SiteFiles } from "./site-files";
import { SiteMaterials } from "./site-materials";

function SiteDescription({
  site,
  role,
}: {
  site: SiteDetails;
  role: SiteMemberRole;
}) {
  const desc =
    site.description ??
    "There is currently no description for this site project";
  return (
    <Card id="description">
      <CardHeader className="flex flex-row font-semibold py-0 items-center">
        <CardTitle className="grow py-6">Description</CardTitle>
        {editSiteRoles.includes(role) && <EditSiteDescription site={site} />}
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line">{desc}</div>
      </CardContent>
    </Card>
  );
}

function SiteInfo({ site }: { site: SiteDetails }) {
  const country = useMemo(() => {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return site.countryCode ? displayNames.of(site.countryCode) : undefined;
  }, [site.countryCode]);

  const info = [
    { label: "Project Id", value: site.id.toString() },
    { label: "Address", value: site.address },
    { label: "Country", value: country },
    { label: "Site Type", value: site.type },
    { label: "Created", value: site.createdAt?.toDateString() },
  ];
  return (
    <Card>
      <ul className="grow flex flex-col py-3 text-sm">
        {info.map((x, i) => (
          <li
            key={i}
            className="grid grid-cols-[5rem_1fr] gap-2 px-6 py-1.5 sm:justify-between hover:bg-muted"
          >
            <p className="font-semibold sm:w-auto">{x.label}:</p>
            <p className="text-end">
              {x.value?.length ? (
                x.value
              ) : (
                <span className="text-muted-foreground">--</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SiteMembersBar({ site }: { site: SiteDetails }) {
  const memberNames: { role: SiteMemberRole; name: string | null }[] = [
    { role: "owner", name: site.ownerName },
    { role: "architect", name: site.architectName },
    { role: "manager", name: site.managerName },
    { role: "contractor", name: site.contractorName },
    { role: "supervisor", name: site.supervisorName },
  ];
  return (
    <Card className="flex flex-col py-3 gap-3">
      <ul className="grow flex flex-col text-sm">
        {memberNames.map((it, i) => (
          <li
            key={i}
            className="flex gap-2 px-6 py-1.5 sm:justify-between hover:bg-muted"
          >
            <p className="font-semibold w-1/3 sm:w-auto">
              {getRoleName(it.role)}:
            </p>
            <p>
              {it.name?.length ? (
                it.name
              ) : (
                <span className="text-muted-foreground">--</span>
              )}
            </p>
          </li>
        ))}
      </ul>
      <div className="px-4 grid grid-cols-2 gap-2">
        <EditKeySiteMembers site={site} dialogName="editMembersBar" />
        <Dialog>
          <Button variant="outline" asChild>
            <DialogTrigger>
              Details <LucideBookUser />
            </DialogTrigger>
          </Button>
          <DialogContent className="px-6 pt-0 max-w-4xl">
            <DialogHeader className="font-semibold flex flex-row justify-between items-center py-0">
              <DialogTitle className="py-6">Project Member Details</DialogTitle>
            </DialogHeader>
            <SiteMembersTable site={site} />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

function SiteMembersTable({ site }: { site: SiteDetails }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-14"></TableHead>
          <TableHead className="w-24">Name</TableHead>
          <TableHead className="w-24">Email</TableHead>
          <TableHead className="w-24">Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead className="font-medium">Owner</TableHead>
          <TableCell>{site.ownerName}</TableCell>
          <TableCell>{site.ownerEmail}</TableCell>
          <TableCell>{site.ownerPhone}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="font-medium">Architect</TableHead>
          <TableCell>{site.architectName}</TableCell>
          <TableCell>{site.architectEmail}</TableCell>
          <TableCell>{site.architectPhone}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="font-medium">Project Manager</TableHead>
          <TableCell>{site.managerName}</TableCell>
          <TableCell>{site.managerEmail}</TableCell>
          <TableCell>{site.managerPhone}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="font-medium">Contractor</TableHead>
          <TableCell>{site.contractorName}</TableCell>
          <TableCell>{site.contractorEmail}</TableCell>
          <TableCell>{site.contractorPhone}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="font-medium">Supervisor</TableHead>
          <TableCell>{site.supervisorName}</TableCell>
          <TableCell>{site.supervisorEmail}</TableCell>
          <TableCell>{site.supervisorPhone}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default async function Page(props: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const siteId = Number((await props.params).siteId);
  const [site, members, role, commentsSectionId] = await Promise.all([
    Actions.getSiteDetails(siteId),
    Actions.listSiteMembers(siteId),
    Actions.getSiteMemberRole({ siteId }),
    Actions.getSiteCommentsSection(siteId),
  ]);

  // TODO custom site not found page
  if (!site) notFound();

  const tab =
    typeof searchParams["tab"] === "string"
      ? searchParams["tab"]
      : "description";

  return (
    <DefaultLayout className="px-8">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center pb-3">
        <Button variant="secondary" asChild>
          <Link href={`/sites`} className="flex items-center gap-2">
            <LucideMoveLeft />
            Back to Site List
          </Link>
        </Button>

        {role && editSiteRoles.includes(role) ? (
          <EditSiteTitle site={site} />
        ) : (
          <div className="grow">
            <h1 className="text-2xl font-semibold">
              Site {site.id}: {site?.title}
            </h1>
          </div>
        )}

        <Button variant={"default"} size={"lg"} asChild>
          <Link
            href={`/sites/${siteId}/reports`}
            className="flex items-center gap-2 [&_svg]:size-6"
          >
            Click Here to View Reports
            <LucideMoveRight />
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={tab} className="w-full gap-4">
        <Card className="mb-8 overflow-hidden">
          <TabsList className="w-full h-auto p-1 [&_button]:h-12 justify-start overflow-x-auto">
            <TabsTriggerSearchParams searchParamsKey="tab" value="description">
              Description
            </TabsTriggerSearchParams>
            <TabsTriggerSearchParams searchParamsKey="tab" value="members">
              Members
            </TabsTriggerSearchParams>
            <TabsTriggerSearchParams searchParamsKey="tab" value="comments">
              Comments
            </TabsTriggerSearchParams>
            <TabsTriggerSearchParams searchParamsKey="tab" value="files">
              Files
            </TabsTriggerSearchParams>
            <div className="grow"></div>
            <TabsTriggerSearchParams searchParamsKey="tab" value="materials">
              Materials
            </TabsTriggerSearchParams>
          </TabsList>
        </Card>

        <TabsContent value="description" className="space-y-4">
          <div className="flex flex-col sm:flex-row-reverse gap-4">
            <div className="flex flex-col gap-4 min-w-56 md:w-1/3 md:max-w-96 shrink-0">
              <SiteInfo site={site} />
              <SiteMembersBar site={site} />
            </div>
            <div className="grow">
              <SiteDescription site={site} role={role} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <SiteMembers site={site} members={members} />
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {commentsSectionId && (
            <CommentsSection commentsSectionId={commentsSectionId} />
          )}
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <SiteFiles site={site} role={role} />
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <SiteMaterials site={site} role={role} />
        </TabsContent>
      </Tabs>
    </DefaultLayout>
  );
}
