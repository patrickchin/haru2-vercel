import Link from 'next/link';
import { LoginOrUserSettings, MainNav } from './header-user-nav';

export default function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 mx-auto max-w-5xl">

        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* <Image className="h-6 w-6" src={icon} alt="logo" /> */}
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