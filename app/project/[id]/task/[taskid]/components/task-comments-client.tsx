"use client";

import { FormEvent, useMemo, useState } from "react";
import { addTaskComment } from "@/lib/actions";
import { DesignTaskComment } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getTaskComments } from "@/lib/db";

export default function TaskCommentsClient({
  taskId,
  comments,
}: {
  taskId: number;
  comments: DesignTaskComment[];
}) {

  const [updatedComments, setUpdatedComments] = useState(comments);

  return (
    <Card>
      <CardHeader className="font-bold">Comments</CardHeader>
      <CardContent>
        <ul className="px-8">
          {updatedComments.map((c, i) => (
            <li
              key={i}
              className="flex gap-6 p-4 items-start justify-center border-b hover:bg-accent"
            >
              <div className="pt-2">
                <Avatar>
                  <AvatarFallback />
                  <AvatarImage
                    src={`/tmp/avatar${(c.users1?.id || 0) % 8}.png`}
                  />
                </Avatar>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-4 items-end">
                  <span className="font-bold">{c.users1?.name}</span>
                  {/* <span className="text-sm">{c.taskcomments1.createdat}</span> */}
                  <span className="text-sm">{(c.taskcomments1.createdat as unknown as Date).toLocaleString()}</span>
                </div>
                <div className="whitespace-pre-line">
                  {c.taskcomments1.comment}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <form
          onSubmit={async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const comment = data.get("comment");
            if (comment) {
              e.currentTarget.reset();
              const newcomment = await addTaskComment(taskId, comment as string);
              if (newcomment) {
                setUpdatedComments((c) => [...c, newcomment]);
                console.log("adding new comment", newcomment);
              }
              // router.refresh();
            }
          }}
          className="flex flex-col px-8 pt-16 gap-4"
        >
          <Textarea
            className="text-base h-48"
            placeholder="Add a comment ..."
            name="comment"
          />
          <div className="flex justify-end gap-4">
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
            <Button variant="default">Save</Button>
          </div>
        </form>

      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}