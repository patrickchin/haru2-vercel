import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { LucideCuboid, LucideEllipsis, LucideForklift, LucideMoveLeft, LucidePersonStanding } from "lucide-react";

function ReportPage({
  register,
  handleSubmit,
  onSubmit,
  saveToLocalStorage,
  setCurrentPage,
}: any) {
  return (
    <>
      <header className="font-bold p-4 text-xl flex items-center gap-4">
        <Button
          type="button"
          onClick={() => setCurrentPage("reports")}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Reports List
        </Button>
        Harpa Pro Offline Report Form
      </header>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4"
        >
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
            onClick={() => setCurrentPage("materials")}
            variant="secondary"
          >
            Materials Storage List <LucideCuboid />
          </Button>
          <Button
            type="button"
            onClick={() => setCurrentPage("equipment")}
            variant="secondary"
          >
            Equipment Storage List <LucideForklift />
          </Button>
          <Button
            type="button"
            onClick={() => setCurrentPage("activities")}
            variant="secondary"
          >
            Construction Activities <LucidePersonStanding />
          </Button>
          <Button
            type="button"
            onClick={() => setCurrentPage("extraDetails")}
            variant="secondary"
          >
            Extra Details <LucideEllipsis />
          </Button>
          <div className="flex flex-col justify-end md:flex-row gap-2 p-4 border rounded bg-muted">
            <Button
              type="button"
              onClick={saveToLocalStorage}
              variant="outline"
            >
              Save Locally
            </Button>
            <Button
              type="button"
              variant="default"
              disabled
            >
              Upload (Coming Soon)
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ReportPage;
