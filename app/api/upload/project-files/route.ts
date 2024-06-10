import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPresigned } from "@/lib/s3";

export async function POST(request: Request): Promise<NextResponse> {
  const { filename, contentType, projectId, specId } = await request.json();

  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json(
      { error: "Unauthenticated access" },
      { status: 400 },
    );

  try {
    const uniqueKey = `project/${projectId}/task/${specId}/${filename}`;
    const { url, fields } = await createPresigned(uniqueKey, contentType);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

    return NextResponse.json({ url, fileUrl, fields });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
