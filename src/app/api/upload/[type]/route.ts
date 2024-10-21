import { NextResponse } from "next/server";
import { Session } from "next-auth";
import { createPresigned } from "@/lib/s3";
import { auth } from "@/lib/auth";
import * as Actions from "@/lib/actions";

// is this even still maintained??
import sanitizeFilename from "sanitize-filename";
import { randomUUID } from "crypto";

function getAvatarPath(session: Session, filename: string) {
  const userId = Number(session.user?.id);
  if (isNaN(userId)) return;
  return `user/${userId}/${filename}`;
}

async function getReportFilePath(
  params: Record<string, string>,
  filename: string,
) {
  if (!params.reportId) return;
  const report = await Actions.getSiteReport(Number(params.reportId));
  if (!report) return;
  return `report/${report.id}/${filename}`;
}

async function getReportSectionFilePath(
  params: Record<string, string>,
  filename: string,
) {
  if (!params.sectionId) return;
  const section = await Actions.getSiteReportSection(Number(params.sectionId));
  if (!section) return;
  return `section/${section.id}/${filename}`;
}

function addRandomUid(filename: string) {
  const uuid = randomUUID();
  return `${uuid}-${filename}`;
}

async function getPath(
  type: string,
  session: Session,
  params: Record<string, string>,
) {
  const unsanFilename = params.filename;
  if (!unsanFilename || unsanFilename.length <= 0) return;
  const filename = addRandomUid(sanitizeFilename(unsanFilename));

  if (type === "avatar") {
    return getAvatarPath(session, filename);
  } else if (type === "report") {
    return getReportFilePath(params, filename);
  } else if (type === "section") {
    return getReportSectionFilePath(params, filename);
  }

  throw new Error(`api/upload getPath unknown type: ${type}`);
}

export async function POST(
  request: Request,
  { params: urlParams }: { params: Promise<{ type: string }> },
): Promise<NextResponse> {
  const params = await request.json();
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthenticated access" },
      { status: 400 },
    );
  }

  const type = (await urlParams).type;
  const path = await getPath(type, session, params);
  if (!path) {
    return NextResponse.json({ error: "Invalid Params" }, { status: 400 });
  }

  try {
    const { url, fields } = await createPresigned(path, params.contentType);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`;

    return NextResponse.json({ url, fileUrl, fields });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 400 },
    );
  }
}
