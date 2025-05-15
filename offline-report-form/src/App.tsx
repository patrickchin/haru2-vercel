import { useState, useEffect } from "react";
import { Card } from "./components/ui/card";
import ReportsListPage from "./pages/ReportsListPage";
import ReportPageForm from "./pages/ReportPage";
import {
  loadReportsLocalStorage,
  saveReportsLocalStorage,
} from "./lib/storage";
import { useForm } from "react-hook-form";
import ActivitiesPage from "./pages/ActivitiesPage";
import DetailsPage from "./pages/DetailsPage";
import { v1 as uuidv1 } from "uuid";

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: params.get("page") || "reportList",
    report: params.get("report") || null,
  };
}

function setParams(
  { page, report }: { page?: string; report?: string | null },
  setParamsStateFn?: (params: any) => void,
) {
  const params = new URLSearchParams(window.location.search);
  if (page) params.set("page", page);
  if (report) params.set("report", report);
  else params.delete("report");
  window.history.pushState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`,
  );
  // Immediately update state to reflect new params
  if (setParamsStateFn) setParamsStateFn(getParams());
}

export default function App() {
  const form = useForm();
  const [allReports, setAllReports] = useState<any | null>(null);
  const [params, setParamsState] = useState(getParams());

  // Sync state with URL params
  useEffect(() => {
    const sync = () => setParamsState(getParams());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // Load reports on mount
  useEffect(() => {
    setAllReports(loadReportsLocalStorage());
  }, []);

  // Reset form when selected report changes
  useEffect(() => {
    if (params.report && allReports && allReports[params.report]) {
      form.reset({ ...allReports[params.report] });
    } else {
      form.reset();
    }
  }, [params.report, allReports, form]);

  const setCurrentPage = (page: string) =>
    setParams(
      { ...params, page, report: page === "reportList" ? null : params.report },
      setParamsState,
    );
  const setSelectedReportUrl = (key: string | null) => {
    setParams(
      { ...params, report: key, page: key ? "report" : "reportList" },
      setParamsState,
    );
    if (key && allReports && allReports[key]) {
      form.reset({ ...allReports[key] });
    } else {
      form.reset({});
    }
  };

  const newReport = () => {
    const key = uuidv1();
    const newReport = {
      key,
      reportTitle: "New Report",
      reporterName: "",
      activities: [],
      details: "", // TODO array of details
    };
    const updatedReports = { ...allReports, [key]: newReport };
    setAllReports(updatedReports);
    saveReportsLocalStorage(updatedReports);
    setSelectedReportUrl(key);
    form.reset({ ...newReport }); // because allReports is not yet updated
    setCurrentPage("report");
  };

  const updateCurrentReport = () => {
    if (!params.report || !allReports) return;
    const updatedReports = {
      ...allReports,
      [params.report]: { ...allReports[params.report], ...form.getValues() },
    };
    setAllReports(updatedReports);
    saveReportsLocalStorage(updatedReports);
  };

  const deleteReport = (key: string) => {
    if (!allReports) return;
    const updatedReports = { ...allReports };
    delete updatedReports[key];
    setAllReports(updatedReports);
    saveReportsLocalStorage(updatedReports);
    if (params.report === key) {
      setSelectedReportUrl(null);
      setCurrentPage("reportList");
    }
  };

  if (!allReports) {
    return (
      <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-auto">
          <div className="p-4">Loading...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto p-3 flex flex-col gap-4">
        {params.page === "report" ? (
          <ReportPageForm
            form={form}
            setCurrentPage={setCurrentPage}
            updateReport={updateCurrentReport}
          />
        ) : params.page === "activities" ? (
          <ActivitiesPage
            form={form}
            setCurrentPage={setCurrentPage}
            updateReport={updateCurrentReport}
          />
        ) : params.page === "details" ? (
          <DetailsPage
            form={form}
            setCurrentPage={setCurrentPage}
            updateReport={updateCurrentReport}
          />
        ) : (
          <ReportsListPage
            allReports={allReports}
            newReport={newReport}
            selectReport={setSelectedReportUrl}
            deleteReport={deleteReport}
          />
        )}
      </Card>
    </div>
  );
}
