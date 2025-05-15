export function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: params.get("page") || "reportList",
    report: params.get("report") || null,
  };
}

export function setParams(
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
