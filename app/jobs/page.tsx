
import { Suspense } from 'react';
import Image from "next/image"
import Link from 'next/link';

import { getAllJobs } from '@/app/db';
import SimpleLayout from '@/app/components/layout';

import houseIcon from "@/app/assets/house.png"

function JobItem(job: any) {
  return (
    <Link href={`/job/${job.id}`}>
      <li key={job.id} className="flex p-5 hover:bg-gray-200 items-center overflow-hidden">
        <Image className="h-8 w-auto m-4" src={houseIcon} alt="building" />
        <div className="text-sm font-semibold leading-6 text-gray-900">
          <p>Job ID: {job.id} User {job.userId}</p>
          <p>{JSON.stringify(job.info)}</p>
        </div>
      </li>
    </Link>
  )
}

async function JobList() {
  const jobs = await getAllJobs();
  return (
    // TODO pagination!
    <ul role="list" className="divide-y divide-gray-100">
      {jobs.reverse().map(JobItem)}
    </ul>
  );
}

export default async function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        
        <h1 className="text-3xl">
          List of Available Jobs
        </h1>

        {/* <ul className="list-disc list-inside">
          <li>TODO Should only be visible to contractors</li>
          <li>Maybe allow the possibility for clients to allow it to be public</li>
        </ul>
      
       */}
        <Suspense fallback={<p>Loading ...</p>}>
          <JobList />
        </Suspense>
        
      </section>
    </SimpleLayout>
  )
}