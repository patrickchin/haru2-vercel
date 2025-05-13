import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Actions from "@/lib/actions";
import { ReportSignButton } from "./report-sign.button";
import { cn } from "@/lib/utils";
import { SiteMemberRole } from "@/lib/types";
import { WarningBox } from "@/components/info-box";
import { getRoleName } from "@/lib/constants";

async function ReportSignature({
  reportId,
  role,
  buttonRole,
  signDate,
  signUserId,
  disabled,
}: {
  reportId: number;
  role?: SiteMemberRole;
  buttonRole: SiteMemberRole;
  signDate?: Date | null;
  signUserId?: string | null;
  disabled?: boolean;
}) {
  const signedBy = signUserId ? await Actions.getUser(signUserId) : undefined;
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">
        {buttonRole && getRoleName(buttonRole)}
      </h4>
      <div
        className={cn(
          "flex flex-col justify-center items-center",
          "border border-dashed h-28 bg-muted rounded",
        )}
      >
        {signDate ? (
          <div className="italic text-center">
            <p>
              <span className="font-semibold">Signed by </span>
              <span>{signedBy?.name}</span>
            </p>
            <p>
              <span className="font-semibold">on </span>
              <span>{signDate.toDateString()}</span>
            </p>
          </div>
        ) : (
          <ReportSignButton
            reportId={reportId}
            role={role}
            buttonRole={buttonRole}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}

export async function ReportSignatureSection({
  reportId,
}: {
  siteId?: number;
  reportId?: number;
  fileId?: number;
}) {
  if (!reportId) return null;

  const [report, role] = await Promise.all([
    reportId ? Actions.getSiteReport(reportId) : undefined,
    reportId ? Actions.getSiteMemberRole({ reportId }) : undefined,
  ]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Signatures</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {report?.publishedAt ? (
          <div className="px-4">
            Sign here to acknowledge having read the report.
          </div>
        ) : (
          <WarningBox>
            Reports cannot be signed until the report has been published so that
            they can no longer be edited.
          </WarningBox>
        )}
        <div className="grid grid-cols-3 gap-4">
          <ReportSignature
            reportId={reportId}
            buttonRole="owner"
            role={role}
            signDate={report?.ownerSignDate}
            signUserId={report?.ownerId}
            disabled={!report?.publishedAt}
          />
          <ReportSignature
            reportId={reportId}
            buttonRole="supervisor"
            role={role}
            signDate={report?.supervisorSignDate}
            signUserId={report?.supervisorId}
            disabled={!report?.publishedAt}
          />
          <ReportSignature
            reportId={reportId}
            buttonRole="architect"
            role={role}
            signDate={report?.architectSignDate}
            signUserId={report?.architectId}
            disabled={!report?.publishedAt}
          />
          <ReportSignature
            reportId={reportId}
            buttonRole="manager"
            role={role}
            signDate={report?.managerSignDate}
            signUserId={report?.managerId}
            disabled={!report?.publishedAt}
          />
          <ReportSignature
            reportId={reportId}
            buttonRole="contractor"
            role={role}
            signDate={report?.contractorSignDate}
            signUserId={report?.contractorId}
            disabled={!report?.publishedAt}
          />
        </div>
      </CardContent>
    </Card>
  );
}
