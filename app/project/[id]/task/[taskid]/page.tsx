import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { CenteredLayout } from '@/components/layout';
import { getUserProject } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getProjectTask, getTaskSpec } from '../../data/tasks';
import { DesignTask, DesignTaskSpec } from '../../data/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectInfoBar } from '../../components/project-description';
import { LucideAxis3D, LucideDownload, LucideFileAxis3D, LucideFileImage, LucideFileSpreadsheet, LucideFileText, LucideImage, LucidePlusCircle, LucideUpload, LucideView } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  // TODO surely online should have a predefinned mapping of this
  const filetypeIcons = [
    { types: ["dwg"], icon: LucideAxis3D },
    { types: ["jpeg", "png"], icon: LucideImage },
    { types: ["xlsx", "csv", "tsv"], icon: LucideFileSpreadsheet },
    { types: ["txt"], icon: LucideFileText },
  ]

  // TODO this will eventually be in a database
  const taskFiles = [
    { name: "FloorPlanFirstFloor.dwg", icon: LucideFileAxis3D, versions: 1 },
    { name: "FloorPlanSecondFloor.dwg", icon: LucideFileAxis3D, versions: 3 },
    { name: "initialDrawing.jpeg", icon: LucideFileImage, versions: 8 },
    { name: "rendering.png", icon: LucideFileImage, versions: 8 },
  ];

  return (
    <section className="grow flex flex-col gap-4">

      <div className="flex flex-col gap-12 pb-8">
        <h3>Project {project.id} - {project.title || session.user.email}</h3>
        <h4>Task {taskId} - {task.title}</h4>
      </div>

      <ProjectInfoBar project={project} />

      <Card>
        <CardHeader className="font-bold">
            Description
        </CardHeader>
        <CardContent className="text-sm">
          {taskSpec && <ul>
            {taskSpec.description.map((desc, i) => <li key={i}>{desc}</li>)}
          </ul>}
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="font-bold">
            Files
        </CardHeader>
        <CardContent className='grid grid-cols-3 gap-3 text-sm'>
          {taskFiles.map((f, i) => 
            <div key={i} className="flex flex-col gap-2 py-4 px-3 border rounded-lg">
              <div className="flex flex-nowrap gap-2 items-center justify-start px-2">
                <f.icon className="h-12 flex-none" />
                <h4 className="text-ellipsis overflow-hidden">{f.name}</h4>
              </div>
              <div className='flex flex-col gap-1'>
                <Button variant="ghost" className='flex gap-2 justify-start'>
                  <LucideView className='h-4'/>View In Browser
                </Button>
                <Button variant="ghost" className='flex gap-2 justify-start'>
                  <LucideDownload className='h-4'/>Download Latest
                </Button>
                <Button variant="ghost" className='flex gap-2 justify-start'>
                  <LucideUpload className='h-4'/>Upload New Version
                </Button>
                <ScrollArea className="h-36 border rounded-sm p-2">
                  {Array.from(Array(f.versions)).map((_, i) => 
                    <div key={i} className='border-b p-2 flex justify-between hover:bg-accent'>
                      <span>Version {f.versions - i}</span>
                      <span>{new Date(Date.now() - (i*5*24*3600*1000)).toDateString()}</span>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center border rounded-lg">
            <Button variant="outline" className="h-16 flex gap-4">
              <LucidePlusCircle className='h-full'/> Add a New File
            </Button>
          </div>

        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>


      <Card>
        <CardHeader className="font-bold">
            Comments
        </CardHeader>
        <CardContent>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>


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