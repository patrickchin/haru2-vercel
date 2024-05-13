import { Suspense } from "react";

import { CenteredLayout } from "@/components/page-layouts";

export default async function Page() {
  return (
    <CenteredLayout>
      <section className="grow flex flex-col gap-12">
        <h2>Consultant portfolio</h2>
        <Suspense fallback={<p>Loading ...</p>}></Suspense>
      </section>
    </CenteredLayout>
  );
}
