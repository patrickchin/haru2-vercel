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

import {
  getProject,
  getProjectFiles,
  getProjectTasks,
  submitEditProjectForm,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import EditableTitle from "@/components/editable-title";
import { FieldValues } from "react-hook-form";

async function ProjectPage({
  projectId,
  tab,
}: {
  projectId: number;
  tab: string | undefined;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const project: DesignProject | undefined = await getProject(projectId);
  if (project === undefined) notFound();
  const files: DesignFile[] | undefined = await getProjectFiles(projectId);
  if (files === undefined) notFound();
  const tasks: DesignTask[] | undefined = await getProjectTasks(projectId);
  if (tasks === undefined) notFound();

  async function handleSubmitProjectEditForm(
    data: FieldValues,
    event?: React.BaseSyntheticEvent,
  ) {
    const fdata = new FormData({ ...event?.target, projectId });
    const submitSuccess = await submitEditProjectForm(fdata);
    if (submitSuccess === null) {
      return Promise.reject(
        "Error submitting update project, server returned null",
      );
    }
  }

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
          <EditableTitle
            project={project}
            // handleSubmitProjectForm={handleSubmitProjectEditForm}
          />
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
            <TabsTrigger asChild value="description">
              <Link
                href={{ query: { tab: "description" } }}
                scroll={false}
                replace={true}
              >
                Description
              </Link>
            </TabsTrigger>
            <TabsTrigger asChild value="teams-progress">
              <Link
                href={{ query: { tab: "teams-progress" } }}
                scroll={false}
                replace={true}
              >
                Teams Progress
              </Link>
            </TabsTrigger>
            <TabsTrigger asChild value="task-details">
              <Link
                href={{ query: { tab: "task-details" } }}
                scroll={false}
                replace={true}
              >
                Task Details
              </Link>
            </TabsTrigger>
            <TabsTrigger asChild value="files">
              <Link
                href={{ query: { tab: "files" } }}
                scroll={false}
                replace={true}
              >
                All Files
              </Link>
            </TabsTrigger>
            <TabsTrigger asChild value="model">
              <Link
                href={{ query: { tab: "model" } }}
                scroll={false}
                replace={true}
              >
                Model View
              </Link>
            </TabsTrigger>
            <TabsTrigger asChild value="settings">
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
