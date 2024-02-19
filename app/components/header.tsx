"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from "next-auth/react"
import { cn } from '@/lib/utils';
import icon from '@/app/assets/icon.png';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', },
  { name: 'Team', href: '/team', },
  { name: 'Jobs', href: '/jobs', },
  // { name: 'Calendar', href: '#', },
]

function MainNav() {
  const pathname = usePathname();
  return (
        <div className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {navigation.map((item, i) => (
            <Link key={i} href={item.href}
              className={cn(
                (pathname.startsWith(item.href) ? '' : 'text-muted-foreground'),
                "text-sm font-medium transition-colors hover:text-primary")} >
              {item.name}
            </Link>)
          )}
        </div>
  );
}

function UserNav() {
  return (
    <div className='flex gap-x-8 text-gray-400'>
      <Link href="/api/auth/signout">
        Logout
      </Link>
    </div>
  );
}

function LoginSignup() {
  return (
    <div className='flex gap-x-8 text-gray-400'>
      <Link href='/login'>
        Login
      </Link>
      <Link href='/register'>
        Join Us Now
      </Link>
    </div>
  );
}

function LoginOrUserSettings() {
  const { data: session, status } = useSession()

  if (status === "authenticated")
    return <UserNav />;

  if (status === "loading")
    return null;

  return <LoginSignup />;
}

export default function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 mx-auto max-w-5xl">
        <div>
          <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image className="h-6 w-6" src={icon} alt="logo" />
            <span className="hidden font-bold sm:inline-block">
              Haru Construction
            </span>
          </Link>
        </div>

        <MainNav />

        <div className="ml-auto flex items-center space-x-4">
          <SessionProvider>
            <LoginOrUserSettings />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
}