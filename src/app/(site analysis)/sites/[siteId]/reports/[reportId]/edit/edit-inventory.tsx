"use client";

import useSWR from "swr";
import { cn } from "@/lib/utils";
import * as Actions from "@/lib/actions";

import { LucideCuboid, LucideForklift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditInventoryMaterialsForm } from "./edit-materials-form";
import { EditInventoryEquipmentForm } from "./edit-equipment-form";

export function EditReportInventory({
  siteId,
  reportId,
}: {
  siteId: number;
  reportId: number;
}) {
  const { data: site, isLoading: siteLoading } = useSWR(
    `/api/site/${siteId}/details`,
    async () => Actions.getSiteDetails(siteId),
  );
  const { data: report, isLoading: reportLoading } = useSWR(
    `/api/reports/${reportId}/details`,
    async () => Actions.getSiteReportDetails(reportId),
  );

  return (
    <Card className="bg-muted">
      <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6">
        <CardTitle className="text-lg grow text-left">
          Inventory and Storage
        </CardTitle>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Open Materials <LucideCuboid />
              </Button>
            </DialogTrigger>

            <DialogContent
              className={cn(
                "min-h-96 max-h-[90svh] h-[50rem]",
                "min-w-80 max-w-[90svw] w-[60rem]",
                "flex flex-col",
              )}
            >
              <DialogTitle className="text-lg font-semibold">
                Materials Storage
              </DialogTitle>
              <DialogDescription className="sr-only">
                Materials Storage Table
              </DialogDescription>
              {site && report && (
                <EditInventoryMaterialsForm site={site} reportId={report.id} />
              )}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Open Equipment <LucideForklift />
              </Button>
            </DialogTrigger>

            <DialogContent
              className={cn(
                "min-h-96 max-h-[90svh] h-[50rem]",
                "min-w-80 max-w-[90svw] w-[60rem]",
                "flex flex-col",
              )}
            >
              <DialogTitle className="text-lg font-semibold">
                Equipment Storage
              </DialogTitle>
              <DialogDescription className="sr-only">
                Equipment Storage Table
              </DialogDescription>
              {site && report && (
                <EditInventoryEquipmentForm site={site} reportId={report.id} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
