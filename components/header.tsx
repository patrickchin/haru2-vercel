import Link from 'next/link';
import { LoginOrUserSettings, MainNav } from './header-user-nav';
import { Construction } from 'lucide-react';

export default function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 mx-auto max-w-5xl">

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Construction className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Haru Construction
          </span>
        </Link>

        <MainNav />

        <div className="ml-auto flex items-center space-x-4">
          <LoginOrUserSettings />
        </div>
      </div>
    </div>
  );
}