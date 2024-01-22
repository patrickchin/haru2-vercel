import Link from 'next/link';
import Image from 'next/image';
import Footer from './components/footer';
import Header from './components/header';

function Trusted() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by the worlds most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <Image
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
            alt="Transistor"
            width={158}
            height={48}
          />
          <Image
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
            alt="Reform"
            width={158}
            height={48}
          />
          <Image
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
            alt="Tuple"
            width={158}
            height={48}
          />
          <Image
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
            alt="SavvyCal"
            width={158}
            height={48}
          />
          <Image
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
            alt="Statamic"
            width={158}
            height={48}
          />
        </div>
      </div>
    </section>
  )
}




export default async function Page() {
  return (
    <div className="h-screen w-screen flow flow-col">
      <Header />
      <main className="flow-1 flex flex-col w-screen mx-auto max-w-5xl">

        <section className="flex flex-col mx-auto my-auto py-12 justify-center">
          <h1 className="text-4xl">Where do you want to build?</h1>
          <div className="grid grid-cols-3 gap-8 justify-center items-center">
            <Link href="/job-posting" className='px-12 py-6 my-24 border border-gray-300 rounded-xl text-2xl text-center hover:bg-gray-300 hover:shadow'>Kenya</Link>
            <Link href="/job-posting" className='px-12 py-6 my-24 border border-gray-300 rounded-xl text-2xl text-center hover:bg-gray-300 hover:shadow'>Pakistan</Link>
            <Link href="/job-posting" className='px-12 py-6 my-24 border border-gray-300 rounded-xl text-2xl text-center hover:bg-gray-300 hover:shadow'>China</Link>
          </div>
        </section>

        {/* {Trusted()} */}

      </main>
      <Footer />
    </div>
  );
}
