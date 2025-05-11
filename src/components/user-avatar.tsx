import { HaruUserBasic } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, getAvatarInitials } from "@/lib/utils";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function HaruUserAvatar({
  user,
  className,
}: {
  user?: HaruUserBasic;
  className?: string;
}) {
  // const userId: number = Math.floor(Math.random() * 1000);
  const userId: number = Number(`0x${user?.id.slice(-8)}`) ?? 0;
  const randomHue: number = ((userId - 1) * 80) % 360;
  const bgCol: string = `hsl(${randomHue} 100 75)`;
  const bgCol2: string = `hsl(${randomHue + 60} 100 90)`;
  return (
    <Avatar
      className={cn("border dark:border-none border-foreground", className)}
    >
      <AvatarImage src={user?.image ?? undefined} />
      <AvatarFallback
        style={{
          backgroundColor: bgCol,
          backgroundImage: `radial-gradient(circle at top left, ${bgCol2}, ${bgCol})`,
        }}
        className="text-lg text-align-center text-foreground dark:text-background"
      >
        {getAvatarInitials(user?.name ?? undefined)}
      </AvatarFallback>
    </Avatar>
  );
}

export function UserAvatar({
  user,
  className,
}: {
  user?: User;
  className?: string;
}) {
  return (
    <HaruUserAvatar
      className={className}
      user={{
        id: user?.id ?? "unknown",
        name: user?.name ?? "?",
        image: user?.image ?? null,

        email: null,
        emailVerified: null,
        createdAt: new Date(),
        role: null,
      }}
    />
  );
}

export function CurrentUserAvatar({ className }: { className?: string }) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <HaruUserAvatar
      className={className}
      user={{
        id: user?.id ?? "unknown",
        name: user?.name ?? "?",
        image: user?.image ?? null,

        email: null,
        emailVerified: null,
        createdAt: new Date(),
        role: null,
      }}
    />
  );
}
