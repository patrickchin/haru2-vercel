import Link from 'next/link';
import { auth, signOut } from '../auth';

const actionSignOut = async () => {
  'use server';
  await signOut();
}

export default async function Header() {
  let session = await auth();

  const signOutButton = (
    <form action={actionSignOut}>
      <button type="submit" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
        Logout
        {/* <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg> */}
      </button>
    </form>
  );

  return (

    <header className="text-gray-600 body-font border border-gray-100 shadow bg-white">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg> */}
          <span className="ml-3 text-xl">Haru Construction</span>
        </a>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
          <a className="mr-5 hover:text-gray-900">First Link</a>
          <a className="mr-5 hover:text-gray-900">Second Link</a>
          <a className="mr-5 hover:text-gray-900">Third Link</a>
          <a className="mr-5 hover:text-gray-900">Fourth Link</a>
        </nav>
        {session?.user && signOutButton}
      </div>
    </header>

  );

  return (
    <header className='sticky top-0 z-40 w-full border border-gray-100 shadow flex justify-center'>
      <div className='w-full max-w-4xl mx-auto py-6 mx-4 flex'>
        <Link href="/" className='flex items-center justify-begin text-2xl'>
            Haru Construction 
        </Link>

        {!session?.user?.email ? null :
          (<div className='flex-1 flex items-center justify-end'>
              <form action={actionSignOut}>
                {session?.user?.email} <button type="submit">Sign out</button>
              </form>
          </div>)
        }
      </div>
    </header>
  );
}