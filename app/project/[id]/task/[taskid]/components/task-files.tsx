import { notFound } from "next/navigation";
import { DesignFile } from "@/lib/types";
import { Suspense } from "react";

import TaskFilesClient from "./task-files-client";
import { getTaskFiles } from "@/lib/actions";

function TaskFilesSkeleton() {
  return <div>loading comments ...</div>;
}

async function TaskFilesFetch({ taskId, specId }: { taskId: number; specId: number }) {
  const files: DesignFile[] | undefined = await getTaskFiles(taskId);
  if (!files) {
    console.log("task: can't find files", taskId);
    notFound();
  }

  return <TaskFilesClient taskId={taskId} files={files} specId={specId} />;
}

export default async function TaskFiles({ taskId, specId }: { taskId: number; specId: number }) {
  return (
    <Suspense fallback={<TaskFilesSkeleton />}>
      <TaskFilesFetch taskId={taskId} specId={specId} />
    </Suspense>
  );
}
