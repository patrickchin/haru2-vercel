"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
      <Button asChild className="bg-gradient-to-br from-cyan-600 to-indigo-600">
        <Link href="/register">Create an Account</Link>
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
          <span className="hidden font-bold sm:inline-block">HarpaPro</span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <Button asChild variant="secondary" className="bg-background-white">
            <Link href="/login">Schedule a Call</Link>
          </Button>
          <LoginOrUserSettings />
        </div>
      </div>
    </div>
  );
}
