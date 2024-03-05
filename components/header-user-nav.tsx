"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'New Project', href: '/new-project', },
  { name: 'Projects', href: '/projects', },
  { name: 'About', href: '/about', },
  // { name: 'Calendar', href: '#', },
]

export function MainNav() {
  const pathname = usePathname();
  const firstPath = '/' + pathname.split('/', 2)[1]; // make sure length > 1 ?
  return (
    <div className="flex items-center mx-6">
      {navigation.map((item, i) => (
        <Button key={i} asChild variant="link" className={(firstPath == item.href ? 'underline' : '')}>
          <Link href={item.href}>
            {item.name}
          </Link>
        </Button>
      ))}
    </div>
  );
}

function UserNav() {
  return (
    <div className='flex gap-x-8 text-gray-400'>
      <Button asChild variant="secondary">
        <Link href="/api/auth/signout">
          Logout
        </Link>
      </Button>
    </div>
  );
}

// TODO user profile avatar and settings dropdown instead of login
function LoginSignup() {
  return (
    <div className='flex gap-x-3'>
      <Button asChild variant="secondary">
        <Link href='/login'>
          Login
        </Link>
      </Button>
      <Button asChild>
        <Link href='/register'>
          Sign Up
        </Link>
      </Button>
    </div>
  );
}

export function LoginOrUserSettings() {
  const { data: session, status } = useSession()

  if (status === "authenticated")
    return <UserNav />;

  if (status === "loading")
    return <UserNav />;

  return <LoginSignup />;
}
