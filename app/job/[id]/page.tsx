import { redirect } from 'next/navigation';

import SimpleLayout from '@/components/layout';
import { getJob } from '@/lib/db';
import { Suspense } from 'react';

async function JobDescription({ jobid }: { jobid: number }) {

  const jobInfoArr = await getJob(jobid);
  if (jobInfoArr.length != 1)
  {
    if (jobInfoArr.length > 1)
      console.log(`Found ${jobInfoArr.length} projects with id ${jobid}`);
    redirect('/404');
  }

  const jobInfo: any = jobInfoArr[0];

  return (
    <>
      <h1 className="text-3xl">
        Project {jobInfoArr[0].id}
      </h1>
      {Object.entries(jobInfo.info).map((desc) =>
        <div key={desc[0]}>
          <h2>{desc[0]}</h2>
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

  const jobid: number = parseInt(params.id);
  if (Number.isNaN(jobid))
    redirect('/projects');

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <Suspense fallback={<p>Loading ...</p>}>
          <JobDescription jobid={jobid}/>
        </Suspense>
      </section>
    </SimpleLayout>
  )
}