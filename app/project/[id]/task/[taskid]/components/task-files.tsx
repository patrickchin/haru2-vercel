import { notFound } from "next/navigation";
import { DesignFile } from "@/lib/types";
import { Suspense } from "react";

import TaskCommentsClient from "./task-comments";
import { getTaskFiles } from "@/lib/db";
import TaskFilesClient from "./task-files-client";

function TaskFilesSkeleton() {
  return <div>loading comments ...</div>;
}

async function TaskFilesFetch({ projectId, specId, taskId }: { projectId: number, specId: number, taskId: number }) {
  const files: DesignFile[] | undefined = await getTaskFiles(taskId);
  if (!files) {
    console.log("task: can't find files", taskId);
    notFound();
  }

  return <TaskFilesClient projectId={projectId} specId={specId} taskId={taskId} files={files} />;
}

export default async function TaskFiles({ projectId, specId, taskId }: { projectId: number, specId: number, taskId: number }) {
  return (
    <Suspense fallback={<TaskFilesSkeleton />}>
      <TaskFilesFetch projectId={projectId} specId={specId} taskId={taskId} />
    </Suspense>
  );
}
