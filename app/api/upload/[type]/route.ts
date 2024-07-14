import { NextResponse } from "next/server";
import { Session } from "next-auth";
import { createPresigned } from "@/lib/s3";
import { auth } from "@/lib/auth";
import * as Actions from "@/lib/actions";

// is this even still maintained??
import sanitizeFilename from "sanitize-filename";

function getAvatarPath(session: Session, filename: string) {
  const userId = Number(session.user?.id);
  if (isNaN(userId)) return;
  return `user/${userId}/${filename}`;
}

async function getTaskFilePath(
  params: Record<string, string>,
  filename: string,
) {
  if (!params.taskId) return;
  const task = await Actions.getTask(Number(params.taskId));
  if (!task || !task.projectid || !task.specid) return;
  return `project/${task.projectid}/task/${task.specid}/${filename}`;
}

async function getProjectFilePath(
  params: Record<string, string>,
  filename: string,
) {
  if (!params.projectId) return;
  const project = await Actions.getProject(Number(params.projectId));
  if (!project) return;
  return `project/${project.id}/${filename}`;
}

async function getPath(session: Session, params: Record<string, string>) {
  const unsanFilename = params.filename;
  if (!unsanFilename || unsanFilename.length <= 0) return;
  const filename = sanitizeFilename(unsanFilename);

  if (params.type === "avatar") {
    return getAvatarPath(session, filename);
  } else if (params.type === "task") {
    return getTaskFilePath(params, filename);
  } else if (params.type === "project") {
    return getProjectFilePath(params, filename);
  }
}

export async function POST(
  request: Request,
  { params: { type } }: { params: { type: string } },
): Promise<NextResponse> {
  const params = await request.json();
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthenticated access" },
      { status: 400 },
    );
  }

  const path = await getPath(session, params);
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
