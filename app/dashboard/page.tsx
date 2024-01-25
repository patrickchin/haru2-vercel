import SimpleLayout from '@/app/components/layout';

export default function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <h1 className="text-3xl">
          Dashboard
        </h1>
      </section>
    </SimpleLayout>
  );
}
