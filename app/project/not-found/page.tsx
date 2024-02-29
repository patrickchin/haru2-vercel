import SimpleLayout from "@/components/layout";

export default async function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <h2>Project not found</h2>
      </section>
    </SimpleLayout>
  )
}