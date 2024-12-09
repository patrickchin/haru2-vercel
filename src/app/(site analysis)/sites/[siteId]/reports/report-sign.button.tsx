"use client";

import * as Actions from "@/lib/actions";
import { SiteMemberRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LucideLoader2 } from "lucide-react";

export function ReportSignButton({
  reportId,
  role,
  buttonRole,
  disabled,
}: {
  reportId: number;
  role?: SiteMemberRole;
  buttonRole: SiteMemberRole;
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      disabled={disabled || role !== buttonRole}
      onClick={async () => {
        try {
          setIsLoading(true);
          await Actions.signReport(reportId, buttonRole);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {isLoading ? (
        <span className="flex gap-2 items-center">
          Signing <LucideLoader2 className="animate-spin" />
        </span>
      ) : (
        <span>Click here to Sign</span>
      )}
    </Button>
  );
}
