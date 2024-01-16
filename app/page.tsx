import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex h-screen">
      <div className="w-screen h-screen flex flex-col justify-center items-center space-y-4">
        <div className="">
          <h1 className="text-2xl">Haru Construction</h1>
        </div>
        <div className="flex space-x-3">
          <Link href="/protected">Dashboard</Link>
          <p>·</p>
          <Link href="/login">Login</Link>
          <p>·</p>
          <Link href="/register">Sign Up</Link>
        </div>
      </div>
    </main>
  );
}
