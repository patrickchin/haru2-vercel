
import { Suspense } from 'react';
import Image from "next/image"
import Link from 'next/link';

import { getAllJobs } from '@/app/db';
import SimpleLayout from '@/app/components/layout';

import houseIcon from "@/app/assets/house.png"

function JobItem(job: any) {
  return (
    <li key={job.id} className="flex p-5 hover:bg-gray-200 items-center overflow-hidden">
      <Image className="h-8 w-auto m-4" src={houseIcon} alt="building" />
      <Link href={`/job/${job.id}`}>
        <div className="text-sm font-semibold leading-6 text-gray-900">
          <p>Job ID: {job.id} User {job.userId}</p>
          <p>{JSON.stringify(job.info)}</p>
        </div>
      </Link>
    </li>
  )
}

async function JobList() {
  const jobs = await getAllJobs();
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {jobs.reverse().map(JobItem)}
    </ul>
  );
}

export default async function Page() {
  return (
    <SimpleLayout>
      <h1>TODO Should only be visible to contractors</h1>
      <h1>Maybe allow the possibility for clients to allow it to be public</h1>
      <section className="text-gray-600 body-font flex justify-center items-center">
        <div className="container px-24 py-24 mx-auto max-w-5xl bg-white">
          <Suspense fallback={<p>Loading ...</p>}>
            <JobList />
          </Suspense>
        </div>
      </section>
    </SimpleLayout>
  )
}