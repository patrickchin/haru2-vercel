import { DesignUserBasic } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, getAvatarInitials } from "@/lib/utils";
import { User } from "next-auth";

export function UserAvatar({
  user,
  className,
}: {
  // user: DesignUserBasic;
  user?: User;
  className?: string;
}) {
  return (
    <Avatar className={cn("", className)}>
      {/* <AvatarImage src={user.avatarUrl ?? undefined} /> */}
      <AvatarImage src={user?.image ?? undefined} />
      <AvatarFallback
        // style={{ backgroundColor: user.avatarColor ?? "lightblue" }}
        style={{ backgroundColor: "lightblue" }}
        className="text-xl text-align-center"
      >
        {getAvatarInitials(user?.name ?? undefined)}
      </AvatarFallback>
    </Avatar>
  );
}

export function DesignUserAvatar({
  user,
  className,
}: {
  user: DesignUserBasic;
  className?: string;
}) {
  return (
    <Avatar className={cn("", className)}>
      <AvatarImage src={user.avatarUrl ?? undefined} />
      <AvatarFallback
        style={{ backgroundColor: user.avatarColor ?? "lightblue" }}
        className="text-xl text-align-center"
      >
        {getAvatarInitials(user.name ?? undefined)}
      </AvatarFallback>
    </Avatar>
  );
}
