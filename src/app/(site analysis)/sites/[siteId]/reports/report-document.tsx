import { cn } from "@/lib/utils";
import * as Actions from "@/lib/actions";
import { ReportSections } from "./report-sections";

import { Button } from "@/components/ui/button";
import { SiteReportAll, SiteMaterial } from "@/lib/types/site";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LucideMaximize2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

async function ReportSiteDetails({ report }: { report?: SiteReportAll }) {
  const site =
    report && report.siteId
      ? await Actions.getSiteDetails(report.siteId)
      : undefined;

  return (
    <Card className="">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-lg">Site Project Details</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 pt-0">
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>Site Title</TableHead>
              <TableCell>{site?.title ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Site Address</TableHead>
              <TableCell>{site?.address ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Visit Date</TableHead>
              <TableCell>{report?.visitDate?.toDateString() ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Publish Date</TableHead>
              <TableCell>
                {report?.publishedAt?.toDateString() ?? "--"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableCell>{site?.ownerName ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Architect</TableHead>
              <TableCell>{site?.architectName ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Project Manger</TableHead>
              <TableCell>{site?.managerName ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Contractor</TableHead>
              <TableCell>{site?.contractorName ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Supervisor</TableHead>
              <TableCell>{site?.supervisorName ?? "--"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ReportBudget({ report }: { report?: SiteReportAll }) {
  return (
    <Card className="bg-yellow-50 hidden">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-lg">
          Current Budget and Timeline Estimates
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 p-4 pt-0">
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>Construction Budget</TableHead>
              <TableCell>{report?.budget ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Budget Spent</TableHead>
              <TableCell>{report?.spent ?? "--"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>Construction Timeline</TableHead>
              <TableCell>{report?.timeline ?? "--"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Completion Date</TableHead>
              <TableCell>
                {report?.completion?.toDateString() ?? "--"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

async function ReportActivities({ report }: { report?: SiteReportAll }) {
  const materials: SiteMaterial[] = report
    ? await Actions.listSiteReportUsedMaterials(report.id) ?? []
    : [];

  return (
    <Card className="bg-cyan-50 dark:bg-cyan-950">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-lg">
          Current Construction Activites
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-0">
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-background space-y-2 rounded border">
            <h2 className="text-base font-semibold">Site Activity</h2>

            <Table>
              <TableBody>
                {report?.activity?.split("\n").map((a, i) => (
                  <TableRow key={i}>
                    <TableCell className="whitespace-pre-line">
                      <p>{a ?? "--"}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center p-3 bg-background rounded border">
            <h2 className="text-base font-semibold">Materials Used</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Open <LucideMaximize2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="min-h-96 max-h-[90svh] h-[50rem] w-[50rem] max-w-full flex flex-col p-4 gap-4">
                <DialogTitle className="text-lg font-semibold">
                  Materials Used
                </DialogTitle>
                <ScrollArea className="grow h-1 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Quantity Unit</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Cost Units</TableHead>
                        <TableHead>Condition</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material, i) => (
                        <TableRow key={i}>
                          <TableCell>{material.name}</TableCell>
                          <TableCell>{material.quantity}</TableCell>
                          <TableCell>{material.quantityUnit}</TableCell>
                          <TableCell>{material.cost}</TableCell>
                          <TableCell>{material.costUnits}</TableCell>
                          <TableCell>{material.condition}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-between items-center p-3 bg-background rounded border">
            <h2 className="text-base font-semibold">Equipment Used</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Open
                  <LucideMaximize2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="min-h-96 max-h-[90svh] h-[50rem] flex flex-col p-4 gap-4">
                <DialogTitle className="text-lg font-semibold">
                  Equipment Used
                </DialogTitle>
                <ol className="overflow-y-auto border rounded grow">
                  {report?.equipmentUsed?.split("\n").map((eq, i) => {
                    return (
                      <li key={i} className="hover:bg-accent px-3 py-2">
                        {eq}
                      </li>
                    );
                  })}
                </ol>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <div className="rounded border p-3 bg-background space-y-2">
            <h2 className="text-base font-semibold">Site Personel</h2>
            <div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead>Contractor</TableHead>
                    <TableCell className="whitespace-pre-line">
                      {report?.contractors ?? "--"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Engineers</TableHead>
                    <TableCell className="whitespace-pre-line">
                      {report?.engineers ?? "--"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Workers</TableHead>
                    <TableCell className="whitespace-pre-line">
                      {report?.workers ?? "--"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Visitors</TableHead>
                    <TableCell className="whitespace-pre-line">
                      {report?.visitors ?? "--"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportInventory({ report }: { report?: SiteReportAll }) {
  return (
    <Card className="">
      <Dialog>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center px-6 py-0">
          <CardTitle className="text-lg py-6">Inventory and Storage</CardTitle>
          <DialogTrigger asChild>
            <Button size="default" variant="outline">
              Open <LucideMaximize2 />
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-between items-center p-0">
          <DialogContent
            className={cn(
              "min-h-96 max-h-[90svh] h-[50rem]",
              "min-w-80 max-w-[90svw] w-[60rem]",
              "grid grid-cols-2",
            )}
          >
            <div className="flex flex-col gap-4">
              <DialogTitle className="text-lg font-semibold">
                Materials Storage
              </DialogTitle>
              <ol className="overflow-y-auto border rounded h-0 grow">
                {report?.materialsInventory?.split("\n").map((eq, i) => {
                  return (
                    <li key={i} className="hover:bg-accent px-3 py-2">
                      {eq}
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="flex flex-col gap-4">
              <DialogTitle className="text-lg font-semibold">
                Equipment Storage
              </DialogTitle>
              <ol className="overflow-y-auto border rounded h-0 grow">
                {report?.equipmentInventory?.split("\n").map((eq, i) => {
                  return (
                    <li key={i} className="hover:bg-accent px-3 py-2">
                      {eq}
                    </li>
                  );
                  })}
              </ol>
            </div>
          </DialogContent>
        </CardContent>
      </Dialog>
    </Card>
  );
}

export async function ReportDocument({
  siteId,
  reportId,
}: {
  siteId?: number;
  reportId?: number;
  fileId?: number;
}) {
  const [site, report, sections /* sectionFiles */] = await Promise.all([
    siteId ? Actions.getSiteDetails(siteId) : undefined,
    reportId ? Actions.getSiteReportDetails(reportId) : undefined,
    reportId ? Actions.listSiteReportSections(reportId) : undefined,
    // Actions.getFilesForReport(reportId),
  ]);
  return (
    <div className="flex flex-col gap-4">
      <ReportSiteDetails report={report} />
      <ReportBudget report={report} />
      <ReportActivities report={report} />
      <ReportInventory report={report} />
      <ReportSections sections={sections} />
    </div>
  );
}
