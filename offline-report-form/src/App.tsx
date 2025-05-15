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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

// Helper component to wrap form logic and routing
function AppRoutes({
  allReports,
  form,
  newReport,
  deleteReport,
  updateCurrentReport,
}: any) {
  const { reportKey } = useParams<{ reportKey?: string }>();

  // Reset form when selected report changes
  useEffect(() => {
    if (reportKey && allReports && allReports[reportKey]) {
      form.reset({ ...allReports[reportKey] });
    } else {
      form.reset();
    }
  }, [reportKey, allReports]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ReportsListPage
            allReports={allReports}
            newReport={newReport}
            deleteReport={deleteReport}
          />
        }
      />
      <Route
        path="/report/:reportKey"
        element={
          <ReportPageForm form={form} updateReport={updateCurrentReport} />
        }
      />
      <Route
        path="/report/:reportKey/activities"
        element={
          <ActivitiesPage form={form} updateReport={updateCurrentReport} />
        }
      />
      <Route
        path="/report/:reportKey/details"
        element={<DetailsPage form={form} updateReport={updateCurrentReport} />}
      />
    </Routes>
  );
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
    // Navigate to new report page
    window.location.hash = ""; // fallback for navigation
    window.location.pathname = `/report/${key}`;
  };

  const updateCurrentReport = () => {
    // Get reportKey from URL
    const match = window.location.pathname.match(/\/report\/([^/]+)/);
    const reportKey = match ? match[1] : null;
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
    if (window.location.pathname.includes(key)) {
      window.location.pathname = "/";
    }
  };

  if (!allReports) {
    return (
      <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto p-3 flex flex-col gap-4 bg-background rounded-md">
          <div className="p-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex justify-center p-2">
        <div className="w-full max-w-2xl mx-auto p-3 flex flex-col gap-4 bg-background rounded-md">
          <AppRoutes
            allReports={allReports}
            setAllReports={setAllReports}
            form={form}
            newReport={newReport}
            deleteReport={deleteReport}
            updateCurrentReport={updateCurrentReport}
          />
        </div>
      </div>
    </Router>
  );
}
