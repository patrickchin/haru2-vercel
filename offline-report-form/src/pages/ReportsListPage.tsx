import { Button } from "@/components/ui/button";
import { LucideX } from "lucide-react";

function ReportsListPage({
  savedReports,
  loadFromLocalStorage,
  deleteReport,
  addNewReport,
}: {
  savedReports: string[];
  loadFromLocalStorage: (title: string) => void;
  deleteReport: (title: string) => void;
  addNewReport: () => void;
}) {
  return (
    <>
      <header className="font-bold p-4 text-xl flex items-center">
        Reports List
      </header>
      <div className="p-4 flex flex-col gap-4">
        <ol className="flex flex-col rounded border">
          {savedReports.length === 0 && (
            <li className="text-muted-foreground text-center text-sm p-4 py-20">
              No saved reports.
            </li>
          )}
          {savedReports.map((title) => (
            <li
              key={title}
              onClick={() => {
                loadFromLocalStorage(title);
              }}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-blue-100 cursor-pointer"
            >
              <span className="font-mono underline">{title}</span>
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the onClick of the li
                  deleteReport(title);
                }}
                title="Delete"
              >
                Delete <LucideX className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <Button type="button" onClick={addNewReport} variant="default">
            Add New Report
          </Button>
        </div>
      </div>
    </>
  );
}

export default ReportsListPage;
