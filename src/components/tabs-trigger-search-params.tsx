"use client";

import { useSearchParams } from "next/navigation";
import { TabsTrigger } from "./ui/tabs";
import React from "react";

export function TabsTriggerSearchParams({
  onClick,
  searchParamsKey,
  ...props
}: React.ComponentProps<typeof TabsTrigger> & {
  searchParamsKey: string;
}) {
  const searchParams = useSearchParams();

  const newQueryString = React.useMemo(() => {
    const params = new URLSearchParams(searchParams);
    params.set(searchParamsKey, props.value);
    return params.toString();
  }, [searchParams, searchParamsKey, props.value]);

  return (
    <TabsTrigger
      {...props}
      onClick={(e) => {
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${newQueryString}`,
        );
        onClick && onClick(e);
      }}
    />
  );
}
