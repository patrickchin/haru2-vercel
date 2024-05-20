import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarInitials(fullname?: string): string {
  if (!fullname) return "?";
  const names = fullname.trim().split(/\s+/);
  const firstname = names.at(0);
  if (!firstname) return "?";

  let initials = firstname.slice(0, 2);
  const lastname = names.at(-1);
  if (lastname && lastname.length > 1 && names.length > 1)
    initials = firstname[0] + lastname[0];

  return initials.toUpperCase();
}
const colors = ["#FF5733", "#34A853", "#4285F4", "#FBBC05", "#EA4335"];
export const randomColor = colors[Math.floor(Math.random() * colors.length)];
