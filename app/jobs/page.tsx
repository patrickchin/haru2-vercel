
import { Suspense } from 'react';
import Image from "next/image"
import Link from 'next/link';

import { getAllJobs } from '@/app/db';
import SimpleLayout from '@/app/components/layout';

import houseIcon from "@/app/assets/house.png"

function JobItem(job: any) {
  return (
    <li key={job.id}>
      <Link href={`/job/${job.id}`} className="flex justify-between gap-x-6 p-8 hover:bg-gray-300">

        <div className="flex min-w-0 gap-x-4">
          <Image className="h-12 w-12 flex-none rounded-full" src={houseIcon} alt="building" />
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900">Job ID: {job.id} - Kenya - 2 Story building</p>
            <p className="mt-1 truncate text-xs leading-5 text-gray-500">Owner ID: {job.userId} example@haru.com</p>
          </div>
        </div>

        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-900">
            Status: pending
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Last updated <time dateTime="2023-01-23T13:23Z">3h ago</time>
          </p>
        </div>

      </Link>
    </li>
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

        <Suspense fallback={<p>Loading ...</p>}>
          <JobList />
        </Suspense>
        
      </section>
    </SimpleLayout>
  )
}