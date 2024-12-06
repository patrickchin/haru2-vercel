"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSession, signOut, useSession } from "next-auth/react";
import { User } from "next-auth";

import { LucideConstruction, LucideSettings, LucideLogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";

export function MainNav({ user }: { user?: User }) {
  const pathname = usePathname();
  const navigation = [
    // { name: "About", href: "/about", needLogin: false },
    { name: "My Projects", href: "/sites", needLogin: true },
  ];

  if (!user) return null;

  return (
    <div className="flex items-center mx-6">
      {navigation.map((item, i) => {
        if (item.needLogin && !user) {
          return null;
        }

        return (
          <Button
            key={i}
            asChild
            variant="link"
            className={pathname == item.href ? "underline" : ""}
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        );
      })}
    </div>
  );
}

function UserNav({ user }: { user?: User }) {
  const signOutAction = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="items-center cursor-pointer">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={20} align="end" className="w-48">
        <DropdownMenuItem className="cursor-pointer flex flex-col items-start px-3">
          <div className="text-lg font-semibold">{user?.name}</div>
          <div>{user?.email}</div>
        </DropdownMenuItem>
        <Link href={"/settings"}>
          <DropdownMenuItem className="cursor-pointer gap-2 px-3">
            <LucideSettings className="w-4 p-0" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={signOutAction}
          className="cursor-pointer gap-2 px-3"
        >
          <LucideLogOut className="w-4 p-0" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

export default function Header() {
  const { data: session, status } = useSession();
  useEffect(() => {
    getSession(); // Ensure session is updated on mount
  }, []);

  return (
    <div className="border-b bg-background w-full">
      <div className="flex h-16 items-center px-8 mx-auto max-w-6xl">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <LucideConstruction className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">Harpa Pro</span>
        </Link>

        <MainNav user={session?.user} />

        <div className="ml-auto flex items-center space-x-4">
          {status === "authenticated" ? (
            <UserNav user={session?.user} />
          ) : (
            <LoginSignup />
          )}
        </div>
      </div>
    </div>
  );
}
