
import SimpleLayout from '@/app/components/layout';
import { Suspense } from 'react';
// import { Suspense } from 'react';
import { getAllJobs } from '../db';

async function List() {

  const jobs = await getAllJobs();

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {jobs.reverse().map((job) => (
        <li key={job.id} className="flex justify-between gap-x-6 py-5">
          <div className="text-sm font-semibold leading-6 text-gray-900">
            <p>Job ID: {job.id} User {job.userId}</p>
            <p>{JSON.stringify(job.info)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// async function Fallback() {
//   return (
//     <p>Loading ...</p>
//   );
// }

export default async function Page() {
  return (
    <SimpleLayout>
      <h1>TODO Should only be visible to contractors</h1>
      <h1>Maybe allow the possibility for clients to allow it to be public</h1>
      <section className="text-gray-600 body-font flex justify-center items-center">
        <div className="container px-24 py-24 mx-auto max-w-5xl bg-white">
          <Suspense fallback={<p>Loading ...</p>}>
            {await List()}
          </Suspense>
        </div>
      </section>
    </SimpleLayout>
  )
}