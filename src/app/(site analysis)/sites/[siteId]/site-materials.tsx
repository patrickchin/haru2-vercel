"use client";

import { GrayBox } from "@/components/info-box";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import * as Actions from "@/lib/actions";
import { SiteDetails, SiteMemberRole, SiteMaterial } from "@/lib/types";
import { LucideArrowRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export function SiteMaterials({
  site,
  role,
}: {
  site: SiteDetails;
  role: SiteMemberRole;
}) {
  const {
    data: materials,
    isLoading,
  } = useSWR<
    (SiteMaterial & {
      activityName: string | null;
      activityEndDate: Date | null;
      reportCreatedDate: Date | null;
    } & any)[]
  >(
    `/api/site/${site.id}/files`,
    async () =>
      (await Actions.listSiteActivityMaterials({ siteId: site.id })) ?? [],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row py-0 items-baseline gap-4">
        <CardTitle className="py-6">Activity Used Materials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GrayBox>Work In Progress ...</GrayBox>
        <Table className="border rounded">
          <TableHeader>
            <TableRow className="[&>th]:px-3 [&>th]:border-r [&>th]:whitespace-nowrap">
              <TableHead className="w-full">Name</TableHead>
              <TableHead className="w-1">Quantity</TableHead>
              <TableHead className="w-1">Cost</TableHead>
              <TableHead className="w-1">Site Activity</TableHead>
              <TableHead className="w-1">Report Date</TableHead>
              <TableHead className="w-1">Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials && materials.length > 0 ? (
              materials.map((m) => (
                <TableRow
                  key={m.id}
                  className="[&>td]:px-3 [&>td]:border-r whitespace-nowrap"
                >
                  <TableCell>{m.name}</TableCell>
                  <TableCell>
                    {m.quantity?.toLocaleString()} {m.quantityUnit}
                  </TableCell>
                  <TableCell>
                    {m.totalCost
                      ? parseFloat(m.totalCost?.toLocaleString())
                      : ""}{" "}
                    {m.totalCostCurrency}
                  </TableCell>
                  <TableCell>{m.activityName}</TableCell>
                  <TableCell>{m.reportCreatedDate?.toDateString()}</TableCell>
                  <TableCell className="text-center align-middle p-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="h-7 w-8 px-0"
                    >
                      <Link href={`/sites/${site.id}/reports/${m.reportId}`}>
                        <LucideArrowRight />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={999} className="p-8 bg-muted text-center">
                  {isLoading ? "Loading ..." : "No used materials"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
