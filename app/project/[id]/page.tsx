import { redirect } from 'next/navigation';

import SimpleLayout from '@/components/layout';
import { getProject } from '@/lib/db';
import { Suspense } from 'react';

async function ProjectDescription({ projectid }: { projectid: number }) {

  const projectInfoArr = await getProject(projectid);
  if (projectInfoArr.length != 1)
  {
    if (projectInfoArr.length > 1)
      console.log(`Found ${projectInfoArr.length} projects with id ${projectid}`);
    redirect('/project');
  }

  const projectInfo: any = projectInfoArr[0].info;

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {projectInfo.title || "Untitled"}
      </h2 >
      <p>
        {projectInfo.country || "Unspecified location"}
      </p>
      <p>
        {projectInfo.type || "Unspecified construction type"}
      </p>
      {Object.entries(projectInfo).map((desc, i) =>
        <div key={i}>
          <h4>{desc[0]}</h4>
          <p>{desc[1] as string}</p>
        </div>
      )}
    </>
  )
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const projectid: number = parseInt(params.id);
  if (Number.isNaN(projectid))
    redirect('/projects');

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <Suspense fallback={<p>Loading ...</p>}>
          <ProjectDescription projectid={projectid}/>
        </Suspense>
      </section>
    </SimpleLayout>
  )
}