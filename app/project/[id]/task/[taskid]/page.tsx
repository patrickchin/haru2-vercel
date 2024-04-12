import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { CenteredLayout } from '@/components/layout';
import { getUserProject } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getProjectTask, getTaskSpec } from '../../data/tasks';
import { DesignTask, DesignTaskSpec } from '../../data/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectInfoBar } from '../../components/project-description';
import TaskFiles from './components/task-files';
import TaskComments from './components/task-comments';
import { Avatar, AvatarFallback, AvatarImage  } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

function MembersList() {

  const members = [
    { name: "Patrick Chin" },
    { name: "Haruna Bayoh" },
    { name: "Jeremy Alva Soetarman" },
    { name: "Su Xing" },
  ];

  return (
    <Card className="w-1/3">
      <CardHeader className="font-bold">
        Members
      </CardHeader>
      <CardContent>
        <ScrollArea >
          <ul className='flex flex-col gap-4'>
            {members.map((mem, i) =>
              <li key={i} className='flex gap-4 items-center'>
                <Avatar>
                  <AvatarFallback />
                  <AvatarImage src={`/tmp/avatar${(i+4)%8}.png`}/>
                </Avatar>
                {mem.name}
              </li>
            )}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

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
      <section className="grow flex flex-col gap-4">

        <div className="flex flex-col gap-12 pb-8">
          <h3>Project {project.id} - {project.title || session.user.email}</h3>
          <h4>Task {taskId} - {task.title}</h4>
        </div>

        <ProjectInfoBar project={project} />

        <div className="flex flex-row gap-4">

          <div className="w-2/3 flex flex-col gap-4">
            <Card className="h-full">
              <CardHeader className="font-bold">
                Description
              </CardHeader>
              <CardContent>
                {taskSpec && <ul>
                  {taskSpec.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>}
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>


            <Card className="h-full">
              <CardHeader className="flex flex-col gap-4">
                <div className="flex">
                  <span className="border-r px-2">
                    <span className="font-bold pr-2">Start:</span>
                    <span>2023-01-01</span>
                  </span>
                  <span className="border-r px-2">
                    <span className="font-bold pr-2">Estimated:</span>
                    <span>4 days</span>
                  </span>
                  <span className="px-2">
                    <span className="font-bold pr-2">Current:</span>
                    <span>4 days</span>
                  </span>
                </div>
                <Progress value={40} indicatorColor='bg-green-400' />
              </CardHeader>
            </Card>

          </div>

          <MembersList />
        </div>

        <TaskFiles />
        <TaskComments />

      </section>
    );
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