import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { CenteredLayout } from '@/components/layout';
import { getUserProject } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getProjectTask, getTaskSpec } from '../../data/tasks';
import { DesignTask, DesignTaskSpec } from '../../data/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

async function ProjectPage({ projectId, taskId }:{
  projectId: number
  taskId: number
}) {

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
  const task: DesignTask | undefined = getProjectTask(projectId, taskId);
  if (task == undefined) { return false; }
  const taskSpec: DesignTaskSpec | undefined = getTaskSpec(task.specid);
  // if (taskSpec == undefined) { return false; }

  return (
    <section className="grow flex flex-col gap-12">
      <h3>Project {project.id} - {project.title || session.user.email}</h3>
      <h4>Task {taskId} - {task.title}</h4>

      {taskSpec && <ul>
        {taskSpec.description.map((desc, i) => <li key={i}>{desc}</li>)}
      </ul>}

    </section>
  )

}

export default function Page({ params }:{ params: { id: string, taskid: string } }) {

  const projectId: number = parseInt(params.id)
  if (Number.isNaN(projectId)) {
    redirect('/project/not-found')
  }

  const taskId: number = parseInt(params.taskid)
  if (Number.isNaN(taskId)) {
    return <pre>{JSON.stringify(params, undefined, 2)}</pre>
  }

  return (
    <CenteredLayout>
      <Suspense fallback={(<p>Loading ...</p>)} >
        <ProjectPage projectId={projectId} taskId={taskId} />
      </Suspense>
    </CenteredLayout>
  )
}