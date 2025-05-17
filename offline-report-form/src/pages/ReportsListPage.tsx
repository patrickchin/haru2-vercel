import { Button } from "@/components/ui/button";
import { LucideX, LucideMoveLeft, LucidePlus } from "lucide-react";

function ReportsListPage({
  allReports,
  newReport,
  deleteReport,
  onSelectReport,
}: {
  allReports: Record<string, any>;
  newReport: () => void;
  deleteReport: (key: string) => void;
  onSelectReport: (key: string) => void;
}) {
  return (
    <>
      <header className="font-bold text-xl flex flex-col gap-4">
        <Button type="button" variant={"default"} asChild>
          <a
            href="https://www.harpapro.com/offline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LucideMoveLeft /> Back to Online Site
          </a>
        </Button>
        <span>Harpa Pro Offline Reports</span>
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
              onClick={() => onSelectReport(report.key)}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-blue-100 cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-mono underline">
                  {report.reportTitle}
                </span>
                {report.reportDate && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(report.reportDate).toDateString()}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteReport(report.key);
                }}
                title="Delete"
              >
                Delete <LucideX className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline">
            Do nothing
          </Button>
          <Button type="button" onClick={() => alert("asdf")} variant="outline">
            Do Alert
          </Button>
          <Button type="button" onClick={() => newReport()} variant="default">
            New Report <LucidePlus />
          </Button>
        </div>
      </div>
    </>
  );
}

export default ReportsListPage;
