import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { CenteredLayout } from '@/components/layout';
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
      <h4>Task ??</h4>
    </section>
  )

}

export default function Page({ params }:{ params: { id: string, taskid: string } }) {

  const projectId: number = parseInt(params.id)
  if (Number.isNaN(projectId)) {
    redirect('/project/not-found')
  }

  const taskid: number = parseInt(params.taskid)
  if (Number.isNaN(taskid)) {
    return <pre>{JSON.stringify(params, undefined, 2)}</pre>
  }

  return (
    <CenteredLayout>
      <Suspense fallback={(<p>Loading ...</p>)} >
        <ProjectPage projectId={projectId} />
      </Suspense>
    </CenteredLayout>
  )
}