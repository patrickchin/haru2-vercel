import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPresigned } from "@/lib/s3";

export async function POST(
  request: Request,
  { params: { type } }: { params: { type: string } },
): Promise<NextResponse> {
  const params = await request.json();
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json(
      { error: "Unauthenticated access" },
      { status: 400 },
    );

  let uniqueKey = "";

  if (type === "avatar") {
    const { filename } = params;
    const userId = Number(session.user.id);
    uniqueKey = `user/${userId}/${filename}`;
  } else if (type === "project-files") {
    const { filename, projectId, specId } = params;
    uniqueKey = `project/${projectId}/task/${specId}/${filename}`;
  } else {
    return NextResponse.json({ error: "Unknown file type." }, { status: 400 });
  }

  try {
    const { url, fields } = await createPresigned(
      uniqueKey,
      params.contentType,
    );
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

    return NextResponse.json({ url, fileUrl, fields });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 400 },
    );
  }
}
