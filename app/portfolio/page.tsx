
import { Suspense } from 'react';

import SimpleLayout from '@/components/layout';

export default async function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Consultant portfolio
        </h2>
        <Suspense fallback={<p>Loading ...</p>}>
        </Suspense>
      </section>
    </SimpleLayout>
  )
}