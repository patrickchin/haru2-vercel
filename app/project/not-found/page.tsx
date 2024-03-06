import { CenteredLayout } from '@/components/layout';

export default async function Page() {
  return (
    <CenteredLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <h2>Project Not Found</h2>
      </section>
    </CenteredLayout>
  )
}