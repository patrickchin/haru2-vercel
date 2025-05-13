import * as Actions from "@/lib/actions";

import { SiteReport } from "@/lib/types/site";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

export async function ReportSiteDetails({
  report,
}: {
  report?: SiteReport;
}) {
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
          </TableBody>
        </Table>
        <Table>
          <TableBody>
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
      </CardContent>
    </Card>
  );
}
