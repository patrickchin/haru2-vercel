import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

import { getProject, getProjectTask, getTaskSpec } from '@/lib/actions';

import { CenteredLayout } from '@/components/page-layouts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage  } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

import { ProjectInfoBar } from '../../components/project-description';
import TaskFiles from './components/task-files';
import TaskComments from './components/task-comments';
import { DesignProject, DesignTask, DesignTaskSpec } from '@/lib/types';
import BackButton from '@/components/back-button';
import { LucideMoveLeft } from 'lucide-react';

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
                  <AvatarImage src={`/tmp/avatar${(i+4)%12}.png`}/>
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

async function TaskPage({ projectId, specId }:{
  projectId: number
  specId: number
}) {

  const session = await auth();
  if (!session?.user) redirect('/login');

  const project: DesignProject | undefined = await getProject(projectId);
  if (!project) { console.log("task: can't find project", projectId); notFound(); }
  const taskSpec: DesignTaskSpec | undefined = await getTaskSpec(specId);
  if (!taskSpec) { console.log("task: can't find spec", projectId, specId); notFound(); }
  const task: DesignTask | undefined = await getProjectTask(projectId, specId);
  if (!task) { console.log("task: can't find task", projectId, specId); notFound(); }

  return (
    <section className="grow flex flex-col gap-4">
      <div className="flex flex-col gap-12 pb-8">
        <div className="flex gap-4 items-center">
          <BackButton variant="secondary"><LucideMoveLeft/></BackButton>
          <h3>Project {project.id} - {project.title || session.user.email}</h3>
        </div>
        <h4>
          Task {specId} - {task.title}
        </h4>
      </div>

      <ProjectInfoBar project={project} />

      <div className="flex flex-row gap-4">
        <div className="w-2/3 flex flex-col gap-4">
          <Card className="h-full">
            <CardHeader className="font-bold">Description</CardHeader>
            <CardContent>{taskSpec?.description}</CardContent>
            <CardFooter></CardFooter>
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
                  <span>10 days</span>
                </span>
              </div>
              <Progress value={40} indicatorColor="bg-green-400" />
            </CardHeader>
          </Card>
        </div>

        <MembersList />
      </div>

      <TaskFiles />
      <TaskComments taskId={task.id} />
    </section>
  );
}

export default function Page({ params }:{ params: { id: string, taskid: string } }) {

  const projectId: number = parseInt(params.id)
  if (Number.isNaN(projectId)) notFound();

  const specId: number = parseInt(params.taskid)
  if (Number.isNaN(specId)) notFound();

  return (
    <CenteredLayout>
      <Suspense fallback={(<p>Loading ...</p>)} >
        <TaskPage projectId={projectId} specId={specId} />
      </Suspense>
    </CenteredLayout>
  )
}