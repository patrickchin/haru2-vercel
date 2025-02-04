import { createContext, useContext, ReactNode } from "react";

interface SiteReportContextProps {
  siteId: number;
  reportId: number;
}

const SiteReportContext = createContext<SiteReportContextProps | undefined>(
  undefined,
);

export const SiteReportProvider = ({
  siteId,
  reportId,
  children,
}: {
  siteId: number;
  reportId: number;
  children: ReactNode;
}) => {

  const [report, memberRole] = await Promise.all([
    Actions.getSiteReport(reportId),
    Actions.getSiteRole(siteId),
  ]);

  return (
    <SiteReportContext.Provider value={{ siteId, reportId }}>
      {children}
    </SiteReportContext.Provider>
  );
};

export const useSiteReport = () => {
  const context = useContext(SiteReportContext);
  if (!context) {
    throw new Error("useSiteReport must be used within a SiteReportProvider");
  }
  return context;
};
