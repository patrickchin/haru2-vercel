"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSession, signOut, useSession } from "next-auth/react";
import { User } from "next-auth";

import { LucideConstruction, LucideSettings, LucideLogOut, LucideSun, LucideMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import { useTheme } from "next-themes";

export function MainNav({ user }: { user?: User }) {
  const pathname = usePathname();
  const navigation = [
    { name: "About Us", href: "/about", needLogin: false },
    { name: "My Sites", href: "/sites", needLogin: true, needAdmin: false },
    { name: "Feedback", href: "/feedback", needLogin: true, needAdmin: true },
    { name: "Logs", href: "/logs", needLogin: true, needAdmin: true },
  ];

  return (
    <div className="flex items-center mx-6 grow">
      {navigation.map((item, i) => {
        if (item.needLogin && !user) return null;
        if (item.needAdmin && user?.role !== "admin") return null;
        
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

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // const [theme, setTheme] = useState("");
  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded-full hidden"
      onClick={() => setTheme((cur) => (cur === "dark" ? "light" : "dark"))}
    >
      <LucideSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <LucideMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
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

        <div className="grow flex flex-row gap-4 items-center justify-end">
          <MainNav user={session?.user} />

          <ThemeToggle />

          <div className="flex items-center space-x-4">
            {status === "authenticated" ? (
              <UserNav user={session?.user} />
            ) : (
              <LoginSignup />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
