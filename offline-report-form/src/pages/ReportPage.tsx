import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  LucideEllipsis,
  LucideMoveLeft,
  LucidePersonStanding,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_PATH } from "../App";

function ReportPageForm({
  form,
  updateReport,
}: {
  form: any;
  updateReport: () => void;
}) {
  const { register } = form;
  const navigate = useNavigate();
  const { reportKey } = useParams<{ reportKey: string }>();

  return (
    <>
      <header className="font-bold text-xl flex items-center gap-4">
        <Button
          type="button"
          onClick={() => navigate(`/${BASE_PATH}/`)}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Reports List
        </Button>
        Harpa Pro Offline Report Form
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
          onClick={() => navigate(`/${BASE_PATH}/report/${reportKey}/activities`)}
          variant="secondary"
        >
          Construction Activities <LucidePersonStanding />
        </Button>
        <Button
          type="button"
          onClick={() => navigate(`/${BASE_PATH}/report/${reportKey}/details`)}
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
