import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { addTaskFile } from "@/lib/actions";
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
 
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        
        const session = await auth();
        if (!session?.user?.id) {
          throw new Error('Unauthenticated user');
        };
        const userId = Number(session.user.id); 

        if (!clientPayload) {
          throw new Error('Missing clientPayload');
        };

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({...JSON.parse(clientPayload), userId}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
        
        if (!tokenPayload) {
          throw new Error('Missing clientPayload');
        };

        console.log('blob upload completed', blob, tokenPayload);
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
          const { taskId, filesize, uploadType } = JSON.parse(tokenPayload);

          if (uploadType === "task") {
            await addTaskFile(taskId, blob.contentType ?? '', blob.pathname, filesize, blob.url);
          }
          else if (uploadType === "comment") {
            // TO DO
          }


        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });
 
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
