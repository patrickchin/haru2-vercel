import { notFound } from "next/navigation";
import { getTaskCommentsAndFiles } from "@/lib/actions";
import { Suspense } from "react";

import TaskCommentsClient from "./task-comments-client";

function TaskCommentsSkeleton() {
  return <div>loading comments ...</div>;
}

async function TaskCommentsFetch({ taskId }: { taskId: number }) {
  const [taskComments, taskFiles] = (await getTaskCommentsAndFiles(taskId)) || [
    undefined,
    undefined,
  ];
  if (!taskComments) {
    console.log("task: can't find task comments", taskId);
    notFound();
  }
  if (!taskFiles) {
    console.log("task: can't find task files", taskId);
    notFound();
  }

  return (
    <TaskCommentsClient
      taskId={taskId}
      comments={taskComments}
      files={taskFiles}
    />
  );
}

export default async function TaskComments({ taskId }: { taskId: number }) {
  return (
    <Suspense fallback={<TaskCommentsSkeleton />}>
      <TaskCommentsFetch taskId={taskId} />
    </Suspense>
  );
}
