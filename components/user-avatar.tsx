import { DesignUserBasic } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

export default function UserAvatar({
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
        {user.name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
