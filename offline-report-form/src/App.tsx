import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "./components/ui/card";
import { LucideConstruction } from "lucide-react";
import ReportsListPage from "./pages/ReportsListPage";
import ReportPage from "./pages/ReportPage";
import MaterialsPage from "./pages/MaterialsPage";
import EquipmentPage from "./pages/EquipmentPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ExtraDetailsPage from "./pages/ExtraDetailsPage";
import { v1 as uuidv1 } from "uuid";

export default function App() {
  const { register, control, handleSubmit, setValue, getValues, reset } =
    useForm();

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: "materials",
  });

  const {
    fields: equipmentFields,
    append: appendEquipment,
    remove: removeEquipment,
  } = useFieldArray({
    control,
    name: "equipment",
  });

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: "activities",
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [savedReports, setSavedReports] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Helper to get all reports from localStorage
  const getAllReports = () => {
    const reports = localStorage.getItem("reports");
    return reports ? JSON.parse(reports) : {};
  };

  // Helper to save all reports to localStorage
  const saveAllReports = (reports: Record<string, any>) => {
    localStorage.setItem("reports", JSON.stringify(reports));
  };

  const getAllReportTitles = () => {
    const reports = getAllReports();
    return Object.values(reports).map(
      (r: any) => r.reportTitle || "Untitled Report",
    );
  };

  const saveToLocalStorage = () => {
    const formData = getValues();
    let key = formData.reportKey;
    if (!key) {
      key = uuidv1();
      formData.reportKey = key;
    }
    const title = formData.reportTitle?.trim();
    if (!title) {
      alert("Please enter a Report Title before saving.");
      return;
    }
    const reports = getAllReports();
    reports[key] = formData;
    saveAllReports(reports);
    setSavedReports(getAllReportTitles());
    setSelectedReport(key);
  };

  const loadFromLocalStorage = React.useCallback(
    (key?: string) => {
      const reportKey = key || selectedReport;
      if (!reportKey) {
        alert("Select a report to load.");
        return;
      }
      const reports = getAllReports();
      const savedData = reports[reportKey] || null;
      if (savedData) {
        Object.keys(savedData).forEach((k) => {
          setValue(k, savedData[k]);
        });
        setSelectedReport(reportKey);
      }
    },
    [setValue, selectedReport],
  );

  const deleteReport = (key: string) => {
    const reports = getAllReports();
    delete reports[key];
    saveAllReports(reports);
    setSavedReports(getAllReportTitles());
    if (selectedReport === key) setSelectedReport(null);
  };

  useEffect(() => {
    setSavedReports(getAllReportTitles());
  }, []);

  const resetForm = () => {
    reset({
      reportTitle: "",
      materials: [],
      equipment: [],
      activities: [],
      extraDetails: "",
      reportDate: new Date().toISOString().split("T")[0],
    });
    setSelectedReport(null);
  };

  const exportToFile = () => {
    const formData = getValues();
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harpapro-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCurrentPage = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "reports";
  };

  const setCurrentPage = (page: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    setCurrentPageState(page);
  };

  const [currentPage, setCurrentPageState] = useState(getCurrentPage());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPageState(getCurrentPage());
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    setCurrentPageState(getCurrentPage());
  }, [window.location.search]);

  const addNewReport = () => {
    const key = uuidv1();
    const baseTitle = "Untitled Report";
    let title = baseTitle;
    let counter = 1;
    const existingTitles = getAllReportTitles();
    while (existingTitles.includes(title)) {
      title = `${baseTitle} ${++counter}`;
    }
    const newReport = {
      reportKey: key,
      reportTitle: title,
      materials: [],
      equipment: [],
      activities: [],
      extraDetails: "",
      reportDate: new Date().toISOString().split("T")[0],
    };
    const reports = getAllReports();
    reports[key] = newReport;
    saveAllReports(reports);
    setSavedReports(getAllReportTitles());
    setSelectedReport(key);
    reset(newReport);
    setCurrentPage("report");
  };

  return (
    <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex items-center justify-center">
      <Button asChild variant="outline" size="lg" className="text-base hidden">
        <a
          href="https://www.harpapro.com/sites"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 left-4 z-10"
        >
          <LucideConstruction />
          <span className="font-bold whitespace-nowrap">
            Harpa Pro Online Site
          </span>
        </a>
      </Button>
      <Card className="w-full max-w-2xl mx-auto min-h-96">
        {currentPage === "reports" ? (
          <ReportsListPage
            savedReports={savedReports}
            loadFromLocalStorage={(title: string) => {
              loadFromLocalStorage(title);
              setCurrentPage("report");
            }}
            deleteReport={deleteReport}
            addNewReport={addNewReport}
          />
        ) : currentPage === "report" ? (
          <ReportPage
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            saveToLocalStorage={saveToLocalStorage}
            loadFromLocalStorage={loadFromLocalStorage}
            resetForm={resetForm}
            exportToFile={exportToFile}
            setCurrentPage={setCurrentPage}
          />
        ) : currentPage === "materials" ? (
          <MaterialsPage
            register={register}
            materialFields={materialFields}
            removeMaterial={removeMaterial}
            appendMaterial={appendMaterial}
            setCurrentPage={setCurrentPage}
          />
        ) : currentPage === "equipment" ? (
          <EquipmentPage
            register={register}
            equipmentFields={equipmentFields}
            removeEquipment={removeEquipment}
            appendEquipment={appendEquipment}
            setCurrentPage={setCurrentPage}
          />
        ) : currentPage === "activities" ? (
          <ActivitiesPage
            register={register}
            control={control}
            activityFields={activityFields}
            removeActivity={removeActivity}
            appendActivity={appendActivity}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <ExtraDetailsPage
            register={register}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
}
