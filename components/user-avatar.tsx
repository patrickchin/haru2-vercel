import { DesignUserBasic } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, getAvatarInitials } from "@/lib/utils";
import { User } from "next-auth";

export function DesignUserAvatar({
  user,
  className,
}: {
  user: DesignUserBasic;
  className?: string;
}) {
  // const userId: number = Math.floor(Math.random() * 1000);
  const userId: number = user?.id ?? 0;
  const randomHue: number = ((userId-1) * 80) % 360;
  const bgCol: string = `hsl(${randomHue} 100 75)`;
  const bgCol2: string = `hsl(${randomHue+60} 100 90)`;
  return (
    <Avatar className={cn("border border-foreground", className)}>
      <AvatarImage src={user?.avatarUrl ?? undefined} />
      <AvatarFallback
        style={{
          backgroundColor: bgCol,
          backgroundImage: `radial-gradient(circle at top left, ${bgCol2}, ${bgCol})`,
        }}
        className="text-lg text-align-center"
      >
        {getAvatarInitials(user.name ?? undefined)}
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
    <DesignUserAvatar
      className={className}
      user={{
        id: Number(user?.id),
        name: user?.name ?? "?",
        email: "",
        avatarUrl: user?.image ?? null,
        avatarColor: "",
      }}
    />
  );
}
