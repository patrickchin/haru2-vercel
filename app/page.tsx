import Link from 'next/link';
import { auth, signOut } from './auth';
import Footer from './components/footer';
import Header from './components/header';

const actionSignOut = async () => {
  'use server';
  await signOut();
}

function LogInOut(loggedIn: boolean) {
    if (loggedIn) {
        return (
            <form action={actionSignOut}>
              <div className='flex space-x-3'>
                <Link href="/dashboard">Dashboard</Link>
                <p>·</p>
                <button>Logout</button>
              </div>
            </form>
        );
    } else {
        return (
            <form>
            <div className='flex space-x-3'>
                <Link href="/login">Login</Link>
                <p>·</p>
                <Link href="/register">Sign Up</Link>
            </div>
            </form>
        );
    }
}


function Trusted() {
  return (
    <div className="bg-red-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
            alt="Transistor"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
            alt="Reform"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
            alt="Tuple"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
            alt="SavvyCal"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
            alt="Statamic"
            width={158}
            height={48}
          />
        </div>
      </div>
    </div>
  )
}




export default async function Page() {
  const session = await auth();
  return (
    <>
      <Header />
      <main className="flex flex-col">

        <section className="text-gray-600 body-font flex justify-center items-center bg-green-100">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h2 className="text-xs text-blue-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven&apos;t heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
            </div>
            <div className="flex flex-wrap">
              <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Create a new Project</h2>
                <p className="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                <a href="/job-posting" className="text-blue-500 inline-flex items-center">Job Posting
                  {/* <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg> */}
                </a>
              </div>
              <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Project Status</h2>
                <p className="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                <a href="job-status" className="text-blue-500 inline-flex items-center">Job Status
                  {/* <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg> */}
                </a>
              </div>
              <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Neptune</h2>
                <p className="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                <a className="text-blue-500 inline-flex items-center">Learn More
                  {/* <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg> */}
                </a>
              </div>
              <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Melanchole</h2>
                <p className="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
                <a className="text-blue-500 inline-flex items-center">Learn More
                  {/* <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg> */}
                </a>
              </div>
            </div>
            <button className="flex mx-auto mt-16 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">Button</button>
          </div>
        </section>

        <section className="text-gray-600 body-font bg-blue-100">
          <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
            <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
              <h1 className="title-font font-medium text-3xl text-gray-900">Slow-carb next level shoindcgoitch ethical authentic, poko scenester</h1>
              <p className="leading-relaxed mt-4">Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder roathse. Craies vegan tousled etsy austin.</p>
            </div>
            <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
              <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
              <div className="relative mb-4">
                <label htmlFor="full-name" className="leading-7 text-sm text-gray-600">Full Name</label>
                <input type="text" id="full-name" name="full-name" className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>
              <button className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">Button</button>
              <p className="text-xs text-gray-500 mt-3">Literally you probably haven&apos;t heard of them jean shorts.</p>
            </div>
          </div>
        </section>

        {Trusted()}

      </main>
      <Footer />
    </>
  );
}
