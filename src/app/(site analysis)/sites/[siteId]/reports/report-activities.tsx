import { Button } from "@/components/ui/button";
import { SiteActivity, SiteReportAll } from "@/lib/types/site";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LucideCuboid, LucideForklift, LucideUsers } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UsedMaterialsTable } from "./report-materials-table";
import { UsedEquipmentTable } from "./report-equipment-table";
import * as Actions from "@/lib/actions";

async function ReportActivity({
  report,
  activity,
}: {
  report?: SiteReportAll;
  activity: SiteActivity;
}) {
  return (
    <div className="grid grid-cols-4 p-4 gap-3 items-center bg-background rounded border">
      <h2 className="text-base">{activity.name}</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Materials <LucideCuboid />
          </Button>
        </DialogTrigger>
        <DialogContent className="min-h-96 max-h-[90svh] h-[50rem] w-[55rem] max-w-full flex flex-col p-4 gap-4">
          <DialogTitle className="text-lg font-semibold">
            Materials Used
          </DialogTitle>
          <DialogDescription className="sr-only">
            Materials Used Table
          </DialogDescription>
          <ScrollArea className="grow h-1 pr-3">
            <UsedMaterialsTable report={report} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Equipment <LucideForklift />
          </Button>
        </DialogTrigger>
        <DialogContent className="min-h-96 max-h-[90svh] h-[50rem] w-[55rem] max-w-full flex flex-col p-4 gap-4">
          <DialogTitle className="text-lg font-semibold">
            Equipment Used
          </DialogTitle>
          <DialogDescription className="sr-only">
            Equipment Used List Table
          </DialogDescription>
          <ScrollArea className="grow h-1 pr-3">
            <UsedEquipmentTable report={report} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled>
            Personnel <LucideUsers />
          </Button>
        </DialogTrigger>
        <DialogContent className="min-h-96 max-h-[90svh] h-[50rem] w-[55rem] max-w-full flex flex-col p-4 gap-4"></DialogContent>
      </Dialog>
    </div>
  );
}

export async function ReportActivities({ report }: { report?: SiteReportAll }) {
  if (!report) return null;

  const activities = await Actions.listSiteReportActivities({
    reportId: report.id,
  });

  return (
    <Card className="bg-cyan-50 dark:bg-cyan-950">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-lg">
          Current Construction Activities
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {activities?.map((activity, i) => (
          <ReportActivity key={i} report={report} activity={activity} />
        ))}
      </CardContent>
    </Card>
  );
}
