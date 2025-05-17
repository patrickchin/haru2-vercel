import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  loadReportsLocalStorage,
  saveReportsLocalStorage,
} from "./lib/storage";
import ReportsListPage from "./pages/ReportsListPage";
import ReportPageForm from "./pages/ReportPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import DetailsPage from "./pages/DetailsPage";

// Helper to get/set next report key in localStorage
function getNextReportKey() {
  const val = localStorage.getItem("nextReportKey");
  return val ? parseInt(val, 10) : 1;
}
function setNextReportKey(val: number) {
  localStorage.setItem("nextReportKey", String(val));
}

export default function App() {
  const form = useForm();
  const [allReports, setAllReports] = useState<any | null>(null);

  // Routing state
  const [route, setRoute] = useState<{ page: string; reportKey?: string }>({
    page: "list",
  });

  // Load reports on mount
  useEffect(() => {
    setAllReports(loadReportsLocalStorage());
  }, []);

  // Reset form when switching reports
  useEffect(() => {
    if (
      route.page === "report" &&
      route.reportKey &&
      allReports &&
      allReports[route.reportKey]
    ) {
      form.reset({ ...allReports[route.reportKey] });
    }
  }, [route.page, route.reportKey, allReports, form]);

  const newReport = () => {
    const key = getNextReportKey();
    setNextReportKey(key + 1);
    const newReport = {
      key,
      reportTitle: `New Report ${key}`,
      reporterName: "",
      reportDate: new Date().toISOString().split("T")[0],
      activities: [],
      details: "",
    };
    const updatedReports = { ...allReports, [key]: newReport };
    setAllReports(updatedReports);
    saveReportsLocalStorage(updatedReports);
    form.reset({ ...newReport });
    setRoute({ page: "report", reportKey: String(key) });
  };

  const updateCurrentReport = () => {
    const reportKey = route.reportKey;
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
    if (route.reportKey === key) {
      setRoute({ page: "list" });
    }
  };

  // Manual routing logic
  let pageContent = null;
  if (allReports) {
    if (route.page === "list") {
      pageContent = (
        <ReportsListPage
          allReports={allReports}
          newReport={newReport}
          deleteReport={deleteReport}
          onSelectReport={(key: string) =>
            setRoute({ page: "report", reportKey: String(key) })
          }
        />
      );
    } else if (route.page === "report" && route.reportKey) {
      pageContent = (
        <ReportPageForm
          form={form}
          updateReport={updateCurrentReport}
          onBack={() => setRoute({ page: "list" })}
          onActivities={() =>
            setRoute({ page: "activities", reportKey: route.reportKey })
          }
          onDetails={() =>
            setRoute({ page: "details", reportKey: route.reportKey })
          }
        />
      );
    } else if (route.page === "activities" && route.reportKey) {
      pageContent = (
        <ActivitiesPage
          form={form}
          updateReport={updateCurrentReport}
          onBack={() =>
            setRoute({ page: "report", reportKey: route.reportKey })
          }
        />
      );
    } else if (route.page === "details" && route.reportKey) {
      pageContent = (
        <DetailsPage
          form={form}
          updateReport={updateCurrentReport}
          onBack={() =>
            setRoute({ page: "report", reportKey: route.reportKey })
          }
        />
      );
    } else {
      pageContent = <div className="p-4">Page not found</div>;
    }
  } else {
    pageContent = <div className="p-4">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex justify-center p-2">
      <div className="w-full max-w-2xl mx-auto p-3 flex flex-col gap-4 bg-background rounded-md">
        {pageContent}
      </div>
    </div>
  );
}
