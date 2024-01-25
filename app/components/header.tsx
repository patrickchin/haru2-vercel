import Link from 'next/link';

export default function Header() {
  return (
      <Link href="/">
        <header className='absolute left-8 top-4 p-4 m-4 bg-white text-2xl font-bold rounded-xl border border-gray-100 shadow-xl'>
            Haru Construct
        </header>
       </Link>
  );
}