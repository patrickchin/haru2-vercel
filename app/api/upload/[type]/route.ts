import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPresigned } from "@/lib/s3";
import * as Actions from "@/lib/actions";

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

  const invalidParamsResponse = NextResponse.json(
    { error: "Invalid Params" },
    { status: 400 },
  );

  const filename = params.filename as string;
  if (!filename || filename.length <= 0) {
    return invalidParamsResponse;
  }

  let path = "";

  if (type === "avatar") {
    const userId = Number(session.user?.id);
    if (isNaN(userId)) return invalidParamsResponse;
    path = `user/${userId}/${filename}`;
  } else if (type === "task") {
    const { taskId } = params;
    if (!taskId) return invalidParamsResponse;
    const task = await Actions.getTask(taskId);
    if (!task || !task.projectid || !task.specid) return invalidParamsResponse;
    path = `project/${task.projectid}/task/${task.specid}/${filename}`;
  } else if (type === "project") {
    const { projectId } = params;
    if (!projectId) return invalidParamsResponse;
    const project = await Actions.getProject(projectId);
    if (!project) return invalidParamsResponse;
    path = `project/${project.id}/${filename}`;
  } else {
    return invalidParamsResponse;
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
