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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

async function ReportActivity({
  reportId,
  activity,
}: {
  reportId: number;
  activity: SiteActivity;
}) {

  const durationDays = activity.endOfDate && activity.startDate
    ? activity.endOfDate.getDate() - activity.startDate.getDate() + 1
    : undefined;


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
            <UsedMaterialsTable reportId={reportId} activityId={activity.id} />
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
            <UsedEquipmentTable reportId={reportId} activityId={activity.id} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Personnel <LucideUsers />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold">
            Personnel Involved
          </DialogTitle>
          <DialogDescription className="sr-only">
            Personnel Involved Table
          </DialogDescription>

          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableCell className="whitespace-pre-line" colSpan={2}>
                  {activity?.contractors ?? "--"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Engineers</TableHead>
                <TableCell className="whitespace-pre-line" colSpan={2}>
                  {activity?.engineers ?? "--"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Visitors</TableHead>
                <TableCell className="whitespace-pre-line" colSpan={2}>
                  {activity?.visitors ?? "--"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead rowSpan={6}>Workers</TableHead>
              </TableRow>
              <TableRow>
                <TableCell className="text-right">
                  {activity?.numberOfWorkers ?? "--"}
                </TableCell>
                <TableCell>workers</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-right">
                  {activity?.workersHoursPerDay ?? "--"}
                </TableCell>
                <TableCell>hours per day</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-right">
                  {activity?.workersCostPerDay ?? "--"}
                </TableCell>
                <TableCell>
                  {activity?.workersCostCurrency ?? "--"} per day
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-right">
                  {durationDays ?? "--"}
                </TableCell>
                <TableCell>
                  total days
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-right">
                  {activity &&
                  activity.numberOfWorkers &&
                  activity.workersCostPerDay &&
                  durationDays
                    ? (
                        activity.numberOfWorkers *
                        parseFloat(activity.workersCostPerDay) *
                        durationDays
                      ).toLocaleString()
                    : "--"}
                </TableCell>
                <TableCell className="whitespace-pre-line">
                  {activity?.workersCostCurrency ?? "--"} total cost
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
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
        <CardTitle className="text-lg">Construction Activities</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {activities && activities.length > 0 ? (
          activities?.map((activity, i) => (
            <ReportActivity key={i} reportId={report.id} activity={activity} />
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            No activities in this report.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
