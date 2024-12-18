"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TabsTrigger } from "./ui/tabs";
import React from "react";

export function TabsTriggerSearchParams({
  onClick,
  searchParamsKey,
  ...props
}: React.ComponentProps<typeof TabsTrigger> & {
  searchParamsKey: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const newQueryString = React.useMemo(() => {
    const params = new URLSearchParams(searchParams);
    params.set(searchParamsKey, props.value);
    return params.toString();
  }, [searchParams]);

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
