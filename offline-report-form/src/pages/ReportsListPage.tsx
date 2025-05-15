import { Button } from "@/components/ui/button";
import { LucideX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ReportsListPage({
  allReports,
  newReport,
  deleteReport,
}: {
  allReports: Record<string, any>;
  newReport: () => void;
  deleteReport: (key: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      <header className="font-bold text-xl flex items-center">
        Reports List
      </header>
      <div className="flex flex-col gap-4">
        <ol className="flex flex-col rounded border">
          {Object.values(allReports).length === 0 && (
            <li className="text-muted-foreground text-center text-sm p-4 py-20">
              No saved reports.
            </li>
          )}
          {Object.values(allReports).map((report: any) => (
            <li
              key={report.key}
              onClick={() => {
                navigate(`/report/${report.key}`);
              }}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-blue-100 cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-mono underline">
                  {report.reportTitle}
                </span>
                {report.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    Created: {new Date(report.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the onClick of the li
                  deleteReport(report.key);
                }}
                title="Delete"
              >
                Delete <LucideX className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <Button type="button" onClick={() => newReport()} variant="default">
            Add New Report
          </Button>
        </div>
      </div>
    </>
  );
}

export default ReportsListPage;
