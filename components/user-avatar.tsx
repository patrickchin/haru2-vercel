import { DesignUserBasic } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, getAvatarInitials } from "@/lib/utils";
import { useSession } from "next-auth/react";
import * as Actions from "@/lib/actions";
import useSWR from "swr";

export function DesignUserAvatar({
  user,
  className,
}: {
  user?: DesignUserBasic;
  className?: string;
}) {
  const userId = user?.id ?? 0;
  const name = user?.name ?? "?";
  const avatarUrl = user?.avatarUrl ?? undefined;

  const hue: number = ((userId - 1) * 80) % 360;
  const bgCol: string = `hsl(${hue} 100 75)`;
  const bgCol2: string = `hsl(${hue + 60} 100 90)`;
  return (
    <Avatar className={cn("border border-foreground", className)}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback
        style={{
          backgroundColor: bgCol,
          backgroundImage: `radial-gradient(circle at top left, ${bgCol2}, ${bgCol})`,
        }}
        className="text-lg text-align-center"
      >
        {getAvatarInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function CurrentUserAvatar({ className }: { className?: string }) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <DesignUserAvatar
      className={className}
      user={{
        id: Number(user?.id),
        name: user?.name ?? "?",
        avatarUrl: user?.image ?? null,
      }}
    />
  );
}
