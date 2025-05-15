import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  LucideEllipsis,
  LucideMoveLeft,
  LucidePersonStanding,
} from "lucide-react";
import { BASE_PATH } from "../App";

// Helper to extract reportKey from search params
function getReportKeyFromSearch() {
  return new URLSearchParams(window.location.search).get("reportKey") || "";
}

function ReportPageForm({
  form,
  updateReport,
}: {
  form: any;
  updateReport: () => void;
}) {
  const { register } = form;
  const reportKey = getReportKeyFromSearch();

  return (
    <>
      <header className="font-bold text-xl flex items-center gap-4">
        <Button
          type="button"
          onClick={() => {
            window.history.pushState({}, "", `/${BASE_PATH}/`);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Reports List
        </Button>
        Offline Report Form
      </header>
      <div className="flex flex-col gap-4 grow">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="pr-4">
                <label htmlFor="reportTitle">Report Title</label>
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  id="reportTitle"
                  {...register("reportTitle")}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pr-4">
                <label htmlFor="reporterName">Reporter Name</label>
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  id="reporterName"
                  {...register("reporterName")}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pr-4">
                <label htmlFor="reportDate">Report Date</label>
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  id="reportDate"
                  {...register("reportDate")}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          type="button"
          onClick={() => {
            window.history.pushState(
              {},
              "",
              `/${BASE_PATH}/?reportKey=${reportKey}&page=activities`
            );
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          variant="secondary"
        >
          Construction Activities <LucidePersonStanding />
        </Button>
        <Button
          type="button"
          onClick={() => {
            window.history.pushState(
              {},
              "",
              `/${BASE_PATH}/?reportKey=${reportKey}&page=details`
            );
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          variant="secondary"
        >
          Details <LucideEllipsis />
        </Button>
      </div>
      <Footer updateReport={updateReport} />
    </>
  );
}

export default ReportPageForm;
