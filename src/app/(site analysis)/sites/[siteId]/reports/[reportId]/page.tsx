import { Suspense } from "react";
import * as Actions from "@/lib/actions";
import { DefaultLayout } from "@/components/page-layouts";
import { ReportDocument } from "../report-document";
import { ReportFileDisplay } from "../report-file-viewer";
import { ReportTitleBar } from "../report-title";

import { ErrorBox, WarningBox } from "@/components/info-box";
import CommentsSection from "@/components/comments-section";
import { ReportSignatureSection } from "../report-sign";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; reportId?: string }>;
  searchParams?: Promise<{ fileId: string }>;
}) {
  const params2 = await params;
  const siteId = Number(params2.siteId);
  const reportId = Number(params2.reportId);
  const fileId = Number((await searchParams)?.fileId);

  const props = { siteId, reportId, fileId };
  const [report, commentsSectionId] = await Promise.all([
    Actions.getSiteReport(reportId),
    Actions.getSiteReportCommentsSectionId(reportId),
  ]);

  return (
    <DefaultLayout className="max-w-none relative p-0 pb-12">
      <section className="w-full sticky top-0 bg-background z-30 py-4 border-b">
        <div className="w-full max-w-5xl mx-auto">
          {/* <Suspense fallback={<ReportTitleBarDisplay />}> */}
          <ReportTitleBar {...props} />
          {/* </Suspense> */}
        </div>
      </section>

      {report?.deletedAt ? (
        <ErrorBox className="w-full max-w-5xl mx-auto">
          This report has been deleted.
        </ErrorBox>
      ) : null}

      {report?.publishedAt ? null : (
        <WarningBox className="w-full max-w-5xl mx-auto">
          This report has NOT yet been published so normal members of this
          project cannot yet view this report. <br />
          To publish this report go to the edit page.
        </WarningBox>
      )}

      <section className="w-full mx-auto">
        <ReportFileDisplay {...props} />
      </section>

      <section className="w-full max-w-5xl mx-auto">
        <Suspense fallback={<ReportDocument />}>
          <ReportDocument {...props} />
        </Suspense>
      </section>

      <section className="w-full max-w-5xl mx-auto">
        <ReportSignatureSection {...props} />
      </section>

      <section className="w-full max-w-5xl mx-auto">
        <Suspense fallback={<div>Loading comments ...</div>}>
          {commentsSectionId && (
            <CommentsSection
              commentsSectionId={commentsSectionId}
              titleClassName="text-lg"
            />
          )}
        </Suspense>
      </section>
    </DefaultLayout>
  );
}
