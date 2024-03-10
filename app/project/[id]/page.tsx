import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { CenteredLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDescription from './project-description';
import ProjectAcceptance from './project-acceptance';
import ProjectProgress from './project-progress';
import { getUserProject } from '@/lib/db';
import { auth } from '@/lib/auth';


async function ProjectPage({ projectId }:{ projectId: number }) {

  const session = await auth();
  const userId = Number(session?.user?.id);

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

  return (
    <section className="grow flex flex-col gap-12">
      <h3>Project {project.id} - {project.title || session.user.email}</h3>
      <Tabs defaultValue="description" className="w-full space-y-5">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="acceptance">Acceptance Status</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <ProjectDescription project={project} />
        </TabsContent>
        <TabsContent value="acceptance">
          <ProjectAcceptance project={project} />
        </TabsContent>
        <TabsContent value="progress">
          <ProjectProgress project={project} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default function Page({ params }:{ params: { id: string } }) {

  const projectId: number = parseInt(params.id);
  if (Number.isNaN(projectId)) {
    redirect('/project/not-found');
  }

  return (
    <CenteredLayout>
      <Suspense fallback={(<p>Loading ...</p>)} >
        <ProjectPage projectId={projectId} />
      </Suspense>
    </CenteredLayout>
  )
}