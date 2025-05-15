const LOCAL_STORAGE_KEY = "harpapro-reports";

// Helper to get all reports from localStorage
export const loadReportsLocalStorage = () => {
  const reports = localStorage.getItem(LOCAL_STORAGE_KEY);
  return reports ? JSON.parse(reports) : {};
};

// Helper to save all reports to localStorage
export const saveReportsLocalStorage = (reports: Record<string, any>) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
};
