"use client";

import Link from "next/link";
import { LucideConstruction } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarInitials } from "@/lib/utils";

const navigation = [
  { name: "New Project", href: "/new-project" },
  { name: "Projects", href: "/projects" },
];

export function MainNav() {
  const pathname = usePathname();
  const firstPath = "/" + pathname.split("/", 2)[1]; // make sure length > 1 ?
  return (
    <div className="flex items-center mx-6">
      {navigation.map((item, i) => (
        <Button
          key={i}
          asChild
          variant="link"
          className={firstPath == item.href ? "underline" : ""}
        >
          <Link href={item.href}>{item.name}</Link>
        </Button>
      ))}
    </div>
  );
}

function UserNav({ user }: { user?: any }) {
  const signOutAction = async () => {
    // Redirect after signing out is handled by NextAuth
    await signOut({
      redirect: true, // This enables redirection after signing out
      callbackUrl: "/", // This sets the URL to redirect to after signing out
    });
  };
  return (
    <div className="flex items-center gap-x-3 text-gray-400">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            {user.image_url ? (
              <AvatarImage
                className="AvatarImage"
                src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
              />
            ) : (
              <AvatarFallback className="AvatarFallback" delayMs={600}>
                {getAvatarInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent className="DropdownMenuContent" sideOffset={5}>
            <ul className="flex flex-col gap-1 divide-y">
              <li className="py-2">
                <Link href={"/settings"}>
                  <DropdownMenuItem className="DropdownMenuItem cursor-pointer gap-4">
                    <Settings className="w-4 p-0" />
                    Settings
                  </DropdownMenuItem>
                </Link>
              </li>
              <li className="py-2">
                <DropdownMenuItem
                  onClick={signOutAction}
                  className="DropdownMenuItem cursor-pointer gap-4"
                >
                  <LogOut className="w-4 p-0" />
                  Log Out
                </DropdownMenuItem>
              </li>
            </ul>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <div className="place-items-center">{user?.name}</div>
    </div>
  );
}

// TODO user profile avatar and settings dropdown instead of login
function LoginSignup() {
  return (
    <div className="flex gap-x-3">
      <Button asChild variant="secondary">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Sign Up</Link>
      </Button>
    </div>
  );
}

export function LoginOrUserSettings() {
  const { data: session, status } = useSession();

  if (status === "authenticated") return <UserNav user={session?.user} />;

  if (status === "loading") return <UserNav />;

  return <LoginSignup />;
}

export default function Header() {
  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-8 mx-auto max-w-6xl">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <LucideConstruction className="h-6 w-6" />
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
