"use client";

import { Button } from "@/components/ui/button";
import * as Actions from "@/lib/actions";
import { LucideBookOpenCheck } from "lucide-react";


export function PublishButton({
  reportId,
  disabled,
}: {
  reportId: number;
  disabled: boolean;
}) {
  return (
    <Button
      variant="default"
      disabled={disabled}
      className="flex gap-2"
      onClick={async () => {
        await Actions.publishReport(reportId);
      }}
    >
      Publish Report
      <LucideBookOpenCheck className="h-5 w-5" />
    </Button>
  );
}