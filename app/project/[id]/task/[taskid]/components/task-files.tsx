import { notFound } from "next/navigation";
import { DesignFile } from "@/lib/types";
import { Suspense } from "react";

import TaskCommentsClient from "./task-comments";
import { getTaskFiles } from "@/lib/db";
import TaskFilesClient from "./task-files-client";

function TaskFilesSkeleton() {
  return <div>loading comments ...</div>;
}

async function TaskFilesFetch({ taskId }: { taskId: number }) {
  const files: DesignFile[] | undefined = await getTaskFiles(taskId);
  if (!files) {
    console.log("task: can't find files", taskId);
    notFound();
  }

  return <TaskFilesClient taskId={taskId} files={files} />;
}

export default async function TaskFiles({ taskId }: { taskId: number }) {
  return (
    <Suspense fallback={<TaskFilesSkeleton />}>
      <TaskFilesFetch taskId={taskId} />
    </Suspense>
  );
}
