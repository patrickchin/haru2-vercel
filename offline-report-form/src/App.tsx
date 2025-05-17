import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { useForm } from "react-hook-form";
import {
  loadReportsLocalStorage,
  saveReportsLocalStorage,
} from "./lib/storage";
import ReportsListPage from "./pages/ReportsListPage";
import ReportPageForm from "./pages/ReportPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import DetailsPage from "./pages/DetailsPage";

// Helper to extract search params
function getSearchParams() {
  return new URLSearchParams(window.location.search);
}
function getReportKeyFromSearch() {
  return getSearchParams().get("reportKey") || "";
}
function getPageFromSearch() {
  return getSearchParams().get("page") || "";
}

// Manual routing component using search params
function ManualRoutes({
  allReports,
  form,
  newReport,
  deleteReport,
  updateCurrentReport,
}: any) {
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    const onPopState = () => setSearch(window.location.search);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // Reset form when selected report changes
    const reportKey = getReportKeyFromSearch();
    if (reportKey && allReports && allReports[reportKey]) {
      form.reset({ ...allReports[reportKey] });
    } else {
      form.reset();
    }
    // eslint-disable-next-line
  }, [search, allReports]);

  const reportKey = getReportKeyFromSearch();
  const page = getPageFromSearch();

  // Routing logic
  if (!reportKey) {
    return (
      <ReportsListPage
        allReports={allReports}
        newReport={newReport}
        deleteReport={deleteReport}
      />
    );
  }
  if (reportKey && !page) {
    return <ReportPageForm form={form} updateReport={updateCurrentReport} />;
  }
  if (reportKey && page === "activities") {
    return <ActivitiesPage form={form} updateReport={updateCurrentReport} />;
  }
  if (reportKey && page === "details") {
    return <DetailsPage form={form} updateReport={updateCurrentReport} />;
  }
  // fallback
  return <div className="p-4">Page not found</div>;
}

export default function App() {
  const form = useForm();
  const [allReports, setAllReports] = useState<any | null>(null);

  // Load reports on mount
  useEffect(() => {
    setAllReports(loadReportsLocalStorage());
  }, []);

  const newReport = () => {
    const key = uuidv1();
    const newReport = {
      key,
      reportTitle: "New Report",
      reporterName: "",
      activities: [],
      details: "",
    };
    const updatedReports = { ...allReports, [key]: newReport };
    setAllReports(updatedReports);
    saveReportsLocalStorage(updatedReports);
    form.reset({ ...newReport });
    // Navigate to new report page using search params
    window.location.hash = "";
    window.history.pushState({}, "", `?reportKey=${key}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const updateCurrentReport = () => {
    // Get reportKey from search params
    const reportKey = getReportKeyFromSearch();
    if (!reportKey || !allReports) return;
    const updatedReports = {
      ...allReports,
      [reportKey]: { ...allReports[reportKey], ...form.getValues() },
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
    // If current report is deleted, go to list
    const reportKey = getReportKeyFromSearch();
    if (reportKey === key) {
      window.history.pushState({}, "", `?`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  if (!allReports) {
    return (
      <div className="bg-gradient-to-t from-sky-100 to-indigo-200 h-full flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto p-3 flex flex-col gap-4 bg-background rounded-md">
          <div className="p-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex justify-center p-2">
      <div className="w-full max-w-2xl mx-auto p-3 flex flex-col gap-4 bg-background rounded-md">
        <ManualRoutes
          allReports={allReports}
          setAllReports={setAllReports}
          form={form}
          newReport={newReport}
          deleteReport={deleteReport}
          updateCurrentReport={updateCurrentReport}
        />
      </div>
    </div>
  );
}
