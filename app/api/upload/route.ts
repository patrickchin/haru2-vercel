import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const { contentType } = await request.json();

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated access"}, { status: 400 });;

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const uniqueKey = `${uuidv4()}`;

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueKey,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // Presigned URL expiration in seconds
    });

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

    return NextResponse.json({ url, fileUrl, fields });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
