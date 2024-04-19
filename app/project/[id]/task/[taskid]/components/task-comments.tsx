import { notFound } from "next/navigation";
import { getTaskComments } from "@/lib/actions";
import { DesignTaskComment } from "@/lib/types";
import { Suspense } from "react";

import TaskCommentsClient from "./task-comments-client";

function TaskCommentsSkeleton() {
  return (<div>loading comments ...</div>)
}

async function TaskCommentsFatch({ taskId, }: { taskId: number; }) {
  const comments: DesignTaskComment[] | undefined = await getTaskComments(taskId);
  if (!comments) { console.log("task: can't find comments", taskId); notFound(); }

  return <TaskCommentsClient taskId={taskId} comments={comments} />
}

export default async function TaskComments({ taskId, }: { taskId: number; }) {
  return (
    <Suspense fallback={(<TaskCommentsSkeleton />)} >
      <TaskCommentsFatch taskId={taskId} />
    </Suspense>
  )
}