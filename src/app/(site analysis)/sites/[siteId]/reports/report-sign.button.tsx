"use client";

import * as Actions from "@/lib/actions";
import { SiteMemberRole } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
  return (
    <Button
      disabled={disabled || role !== buttonRole}
      onClick={async () => Actions.signReport(reportId, buttonRole)}
    >
      Click here to Sign
    </Button>
  );
}
