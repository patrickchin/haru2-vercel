"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage  } from '@/components/ui/avatar';
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";

export default function TaskComments() {

  const session = useSession();  

  const defaultComments = [
    {
      "commentId": 1,
      "pageId": 1,
      "userId": 3,
      "parentCommentId": null,
      "content": "Sample comment content 1",
      "createdAt": "2023-09-15 15:51:29",
      "username": "Alice"
    },
    {
      "commentId": 2,
      "pageId": 3,
      "userId": 1,
      "parentCommentId": null,
      "content": "Sample comment content 2",
      "createdAt": "2023-09-07 11:42:08",
      "username": "Bob"
    },
    {
      "commentId": 11,
      "pageId": 3,
      "userId": 2,
      "parentCommentId": 2,
      "content": "This is a reply to comment 2",
      "createdAt": "2023-12-21 04:54:13",
      "username": "Charlie"
    },
    {
      "commentId": 12,
      "pageId": 3,
      "userId": 3,
      "parentCommentId": 11,
      "content": "This is a nested reply to the reply of comment 2",
      "createdAt": "2023-01-01 14:48:04",
      "username": "Alice"
    },
    {
      "commentId": 3,
      "pageId": 2,
      "userId": 2,
      "parentCommentId": null,
      "content": "Sample comment content 3",
      "createdAt": "2023-08-13 10:54:55",
      "username": "Diana"
    },
    {
      "commentId": 4,
      "pageId": 2,
      "userId": 3,
      "parentCommentId": null,
      "content": "Sample comment content 4",
      "createdAt": "2023-10-05 13:56:47",
      "username": "Diana"
    },
    // ... Additional comments would follow in the same flat structure
  ];

  const [comments, setComments] = useState(defaultComments);

  const commentbox = useRef(null);

  return (
    <Card>
      <CardHeader className="font-bold">
        Comments
      </CardHeader>
      <CardContent>
        <ul className="px-8">
          {comments.map((c, i) =>
            <li key={i} className="flex gap-6 p-4 items-center border-b hover:bg-accent">
              <Avatar>
                <AvatarFallback />
                <AvatarImage src={`/tmp/avatar${c.userId % 8}.png`} />
              </Avatar>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-4 items-end">
                  <span className="font-bold">{c.username}</span>
                  <span className="text-sm">{c.createdAt}</span>
                </div>
                <div>
                  {c.content}
                </div>
              </div>
            </li>
          )}
        </ul>
        <div className="flex flex-col px-8 pt-16 gap-4">
          <Textarea className="text-base h-48" placeholder="Add a comment ..." ref={commentbox}/>
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => {
              if (commentbox && commentbox.current) 
                (commentbox.current as any).value = '';
            }}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => {
              if (commentbox && commentbox.current) {

                const newcomment = {
                  "commentId": 4,
                  "pageId": 2,
                  "userId": Number(session.data?.user?.id),
                  "parentCommentId": null,
                  "content": (commentbox.current as any).value,
                  "createdAt": new Date(Date.now()).toLocaleString(),
                  "username": session.data?.user?.name || "<unknown>",
                };
                (commentbox.current as any).value = '';

                setComments((c) => {
                  c.push(newcomment);
                  // need to create a new array rather than passing the same one
                  return [...c];
                });

              }
            }}>
              Save
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}