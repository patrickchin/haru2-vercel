import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getUserProject } from '@/lib/db';

import { CenteredLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ProjectDescription from './components/project-description';
import ProjectSettings from './components/project-settings';
import ProjectModelView from './components/project-model-view';
import ProjectTaskDetails, { ProjectTaskDetailsSkeleton } from './components/project-task-details';
import ProjectTeamsProgress, { ProjectTeamsProgressSkeleton } from './components/project-teams-progress';

async function ProjectPage({ projectId, tab }:{ projectId: number, tab: string | undefined }) {

  const session = await auth();
  const userId = Number(session?.user?.id);

  //  apparently this is not good enough
  if (!session?.user)
    redirect('/login');

  if (Number.isNaN(userId)) {
    console.log("User id is invalid: ", session);
    return <p>Invalid user</p>;
  }

  const projectInfoArr = await getUserProject(userId, projectId);
  if (projectInfoArr.length < 1)
    redirect('/project/not-found'); // it might not be the users project
  if (projectInfoArr.length > 1)
    console.log(`Found ${projectInfoArr.length} projects with id ${projectId}`);

  const project: any = projectInfoArr[0];

  // TODO validate tab it could be a stirng that is not a tab

  return (
    <section className="grow flex flex-col gap-12">
      <h3>Project {project.id} - {project.title || session.user.email}</h3>
      <Tabs defaultValue={tab || 'description'} className="w-full space-y-5">
        <TabsList>
          <TabsTrigger asChild value="description">
            <Link href={{ query: { tab: 'description' } }} scroll={false} replace={false}>
              Description
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="teams-progress">
            <Link href={{ query: { tab: 'teams-progress' } }} scroll={false} replace={false}>
              Teams Progress
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="task-details">
            <Link href={{ query: { tab: 'task-details' } }} scroll={false} replace={false}>
              Task Details
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="files">
            <Link href={{ query: { tab: 'files' } }} scroll={false} replace={false}>
              All Files
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="model">
            <Link href={{ query: { tab: 'model' } }} scroll={false} replace={false}>
              Model View
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="settings">
            <Link href={{ query: { tab: 'settings' } }} scroll={false} replace={false}>
              Settings
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="space-y-8">
          <ProjectDescription project={project} />
        </TabsContent>
        <TabsContent value="teams-progress">
          <Suspense fallback={(<ProjectTeamsProgressSkeleton />)} >
            <ProjectTeamsProgress project={project} />
          </Suspense>
        </TabsContent>
        <TabsContent value="task-details">
          <Suspense fallback={(<ProjectTaskDetailsSkeleton />)} >
            <ProjectTaskDetails project={project} />
          </Suspense>
        </TabsContent>
        <TabsContent value="model">
          Loading files...
        </TabsContent>
        <TabsContent value="model">
          <ProjectModelView project={project} />
        </TabsContent>
        <TabsContent value="settings">
          <ProjectSettings project={project} />
        </TabsContent>
      </Tabs>

    </section>
  )
}

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const projectId: number = parseInt(params.id);
  if (Number.isNaN(projectId)) {
    redirect('/project/not-found');
  }

  const tabParam = searchParams["tab"];
  const tab: string | undefined = Array.isArray(tabParam) ? tabParam[0] : tabParam;

  return (
    <CenteredLayout>
      <Suspense fallback={(<p>Loading ...</p>)} >
        <ProjectPage projectId={projectId} tab={tab} />
      </Suspense>
    </CenteredLayout>
  )
}