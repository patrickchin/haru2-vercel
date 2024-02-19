import SimpleLayout from "@/components/layout";

export default async function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <h1>Job not found</h1>
      </section>
    </SimpleLayout>
  )
}