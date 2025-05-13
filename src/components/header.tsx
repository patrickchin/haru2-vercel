"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSession, signOut, useSession } from "next-auth/react";
import { User } from "next-auth";

import {
  LucideConstruction,
  LucideSettings,
  LucideLogOut,
  LucideSun,
  LucideMoon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function MainNav({ className }: { className?: string }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const globalNav = [
    { name: "About Us", href: "/about" },
    // { name: "Contact Us", href: "/contact", },
    // { name: "Docs", href: "/docs" },
    { name: "Offline", href: "/offline" },
  ];

  const userNav = [
    { name: "My Sites", href: "/sites", needLogin: true, needAdmin: false },
    { name: "Feedback", href: "/feedback", needLogin: true, needAdmin: true },
    { name: "Logs", href: "/logs", needLogin: true, needAdmin: true },
  ];
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row grow",
        className,
      )}
    >
      {globalNav.map((item, i) => {
        return (
          <Button
            key={i}
            asChild
            variant="link"
            className={cn(pathname == item.href ? "underline" : "")}
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        );
      })}

      <div className="grow"></div>

      {userNav.map((item, i) => {
        if (item.needLogin && !session?.user) return null;
        if (item.needAdmin && session?.user?.role !== "admin") return null;
        return (
          <Button
            key={i}
            asChild
            variant="link"
            className={cn(pathname == item.href ? "underline" : "")}
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        );
      })}
    </div>
  );
}

function UserMenu({ user }: { user?: User }) {
  const signOutAction = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  return (
    <DropdownMenu modal={false}>
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
      <Button asChild variant="default">
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
      className="rounded-full"
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
    <div className="border-b bg-background w-full shadow-md">
      <div className="flex gap-2 min-h-16 md:h-16 items-start px-8 mx-auto max-w-7xl">
        <Link href="/" className="mr-4 flex items-center space-x-2 h-16">
          <LucideConstruction className="h-6 w-6" />
          <span className="font-bold whitespace-nowrap">
            Harpa Pro
          </span>
        </Link>

        <MainNav className="md:inline-flex md:h-16 items-center" />

        <div className="inline-flex flex-row gap-3 items-center h-16">
          <ThemeToggle />
          <div className="flex items-center space-x-4 ml-1">
            {status === "authenticated" ? (
              <UserMenu user={session?.user} />
            ) : (
              <LoginSignup />
            )}
          </div>
        </div>

        {/* <MainNav user={session?.user} className="" /> */}

      </div>
    </div>
  );
}
