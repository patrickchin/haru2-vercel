import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { LucideFolderKanban, LucideMoveLeft } from "lucide-react";
import { DesignFile, DesignProject, DesignTask } from "@/lib/types";
import { auth } from "@/lib/auth";
import Link from "next/link";

import { CenteredLayout } from "@/components/page-layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProjectDescription from "./components/project-description";
import ProjectSettings from "./components/project-settings";
import ProjectModelView from "./components/project-model-view";
import ProjectTaskDetails, {
  ProjectTaskDetailsSkeleton,
} from "./components/project-task-details";
import ProjectTeamsProgress, {
  ProjectTeamsProgressSkeleton,
} from "./components/project-teams-progress";
import ProjectFiles, {
  ProjectFilesSkeleton,
} from "./components/project-task-files";

import { getProject, getProjectFiles, getProjectTasks } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import EditableTitle from "@/components/editable-title";

async function ProjectPage({
  projectId,
  tab,
}: {
  projectId: number;
  tab: string | undefined;
}) {
  const [project, files, tasks] = await Promise.all([
    getProject(projectId),
    getProjectFiles(projectId),
    getProjectTasks(projectId),
  ]);

  if (project === undefined) notFound();
  if (files === undefined) notFound();
  if (tasks === undefined) notFound();

  // TODO validate tab it could be a stirng that is not a tab

  return (
    <section className="grow flex flex-col gap-12">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-4 items-center">
          <Button asChild variant="secondary" className="shadow-md">
            <Link href="/projects">
              <LucideMoveLeft />
            </Link>
          </Button>
          <EditableTitle project={project} />
        </div>
        <Button asChild variant="default">
          <Link href={`/project/${projectId}/manage`} className="space-x-2">
            <LucideFolderKanban />
            <span>Manage Project</span>
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue={tab || "description"}
        className="w-full flex flex-col grow space-y-5"
      >
        <div>
          <TabsList className="shadow-sm">
            <TabsTrigger value="description">
              <Link
                href={{ query: { tab: "description" } }}
                scroll={false}
                replace={true}
              >
                Description
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="teams-progress"
              disabled={project.status === "pending"}
              className="disabled:cursor-not-allowed"
            >
              <Link
                href={{ query: { tab: "teams-progress" } }}
                scroll={false}
                replace={true}
              >
                Teams Progress
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="task-details"
              disabled={project.status === "pending"}
              className="disabled:cursor-not-allowed"
            >
              <Link
                href={{ query: { tab: "task-details" } }}
                scroll={false}
                replace={true}
              >
                Task Details
              </Link>
            </TabsTrigger>
            <TabsTrigger value="files">
              <Link
                href={{ query: { tab: "files" } }}
                scroll={false}
                replace={true}
              >
                All Files
              </Link>
            </TabsTrigger>
            <TabsTrigger value="model">
              <Link
                href={{ query: { tab: "model" } }}
                scroll={false}
                replace={true}
              >
                Model View
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Link
                href={{ query: { tab: "settings" } }}
                scroll={false}
                replace={true}
              >
                Settings
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="description" className="space-y-8">
          <ProjectDescription project={project} />
        </TabsContent>
        <TabsContent value="teams-progress">
          <Suspense fallback={<ProjectTeamsProgressSkeleton />}>
            <ProjectTeamsProgress project={project} tasks={tasks} />
          </Suspense>
        </TabsContent>
        <TabsContent value="task-details">
          <Suspense fallback={<ProjectTaskDetailsSkeleton />}>
            <ProjectTaskDetails project={project} tasks={tasks} />
          </Suspense>
        </TabsContent>
        <TabsContent value="files">
          <Suspense fallback={<ProjectFilesSkeleton />}>
            <ProjectFiles files={files} />
          </Suspense>
        </TabsContent>
        <TabsContent value="model" className="flex flex-col grow">
          <ProjectModelView />
        </TabsContent>
        <TabsContent value="settings">
          <ProjectSettings project={project} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const projectId: number = parseInt(params.id);
  if (Number.isNaN(projectId)) {
    redirect("/project/not-found");
  }

  const tabParam = searchParams["tab"];
  const tab: string | undefined = Array.isArray(tabParam)
    ? tabParam[0]
    : tabParam;

  return (
    <CenteredLayout>
      <Suspense fallback={<p>Loading ...</p>}>
        <ProjectPage projectId={projectId} tab={tab} />
      </Suspense>
    </CenteredLayout>
  );
}
