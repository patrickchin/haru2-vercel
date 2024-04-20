"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LucideLoader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { addTaskComment, getTaskComments } from "@/lib/actions";
import { DesignTaskComment } from "@/lib/types";

function LoadNewComments({
  taskId,
  setUpdatedComments,
}: {
  taskId: number;
  setUpdatedComments: Dispatch<SetStateAction<DesignTaskComment[]>>;
}) {
  const [loadingNewComments, setLoadingNewComments] = useState(false);

  return (
    <Button
      variant="secondary"
      disabled={loadingNewComments}
      onClick={async () => {
        setLoadingNewComments(true);
        const newcomments = await getTaskComments(taskId);
        if (newcomments) setUpdatedComments(newcomments);
        setLoadingNewComments(false);
      }}
      className="flex flex-row gap-3"
    >
      Check for New Comments
      <LucideLoader2
        className={cn("animate-spin h-4", loadingNewComments ? "" : "hidden")}
      />
    </Button>
  );
}

function AddCommentForm() {
  const formStatus = useFormStatus();
  return (
    <>
      <Textarea
        className="text-base h-24"
        placeholder="Add a comment ..."
        name="comment"
        disabled={formStatus.pending}
      />
      <div className="flex justify-end gap-4">
        <Button type="reset" variant="secondary" disabled={formStatus.pending}>
          Cancel
        </Button>
        <Button variant="default" disabled={formStatus.pending}>
          Save
          <LucideLoader2
            className={cn(
              "animate-spin h-4",
              formStatus.pending ? "" : "hidden"
            )}
          />
        </Button>
      </div>
    </>
  );
}

export default function TaskCommentsClient({
  taskId,
  comments,
}: {
  taskId: number;
  comments: DesignTaskComment[];
}) {
  const pathname = usePathname();
  const [updatedComments, setUpdatedComments] = useState(comments);

  // // is this a hack? is this normal practice??
  // const fragment =
  //   typeof window !== "undefined"
  //     ? window.location.hash
  //     : "";

  return (
    <Card>
      <CardHeader className="font-bold">Comments</CardHeader>
      <CardContent className="flex flex-col gap-8 px-16 py-6">
        <form
          onSubmit={async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const comment = data.get("comment");
            if (comment) {
              e.currentTarget.reset();
              const newcomments = await addTaskComment(
                taskId,
                comment as string
              );
              if (newcomments) {
                setUpdatedComments(newcomments);
              }
            }
          }}
          className="flex flex-col gap-4"
        >
          <AddCommentForm />
        </form>

        <LoadNewComments
          taskId={taskId}
          setUpdatedComments={setUpdatedComments}
        />

        <ul className="">
          {updatedComments.map((c, i) => (
            <li
              id={`comment-${c.taskcomments1.id}`}
              key={i}
              className={cn(
                "flex gap-6 p-4 items-start justify-center border-b hover:bg-accent"
                // fragment == `#comment-${c.taskcomments1.id}` ? "bg-yellow-50" : ""
              )}
            >
              <div className="pt-2">
                <Avatar>
                  <AvatarFallback />
                  <AvatarImage
                    src={`/tmp/avatar${(c.users1?.id || 0) % 12}.png`}
                  />
                </Avatar>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-4 items-end">
                  <span className="font-bold">{c.users1?.name}</span>
                  {/* <span className="text-sm">{c.taskcomments1.createdat}</span> */}
                  <Link
                    href={{
                      pathname: pathname,
                      hash: `#comment-${c.taskcomments1.id}`,
                    }}
                    className="text-sm text-muted-foreground"
                  >
                    {(
                      c.taskcomments1.createdat as unknown as Date
                    ).toLocaleString()}
                  </Link>
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {c.taskcomments1.comment}
                </div>
              </div>
            </li>
          ))}
          {updatedComments.length == 0 && (
            <li>There are currently no coments to display</li>
          )}
        </ul>

        {/* <Button variant="secondary">Load all older Comments</Button> */}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}