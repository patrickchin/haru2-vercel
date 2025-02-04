import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { SiteReportAll } from "@/lib/types/site";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LucideCuboid, LucideForklift } from "lucide-react";
import { InventoryMaterialsTable } from "./report-materials-table";
import { InventoryEquipmentTable } from "./report-equipment-table";

export function ReportInventory({ report }: { report?: SiteReportAll }) {
  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center bg-muted">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center p-6 pr-0">
        <CardTitle className="text-lg">Inventory and Storage</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row gap-2 p-6 pl-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="default" variant="outline">
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
            <InventoryMaterialsTable report={report} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="default" variant="outline">
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
            <InventoryEquipmentTable report={report} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
