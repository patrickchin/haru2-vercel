import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export function createPresigned(uniqueKey: string, contentType: string) {
  const client = new S3Client({ region: process.env.AWS_REGION });

  return createPresignedPost(client, {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: uniqueKey,
    Conditions: [
      ["content-length-range", 0, 262144000], // up to 250 MB
      ["starts-with", "$Content-Type", contentType],
    ],
    Fields: {
      acl: "public-read",
      "Content-Type": contentType,
    },
    Expires: 600, // Presigned URL expiration in seconds
  });
}

export async function deleteFileFromS3(key: string) {
  const client = new S3Client({ region: process.env.AWS_REGION });
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await client.send(command);
    console.log("Successfully deleted file from S3:", key);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
  }
}
