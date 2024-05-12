import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarInitials(fullName: string | null | undefined): string {
  if (!fullName) return "";
  const names = fullName.trim().split(/\s+/);
  let initials = "";

  if (names.length === 1) {
    initials = names[0].slice(0, 2);
  } else if (names.length > 1) {
    const lastName = names.at(-1);
    if (lastName) {
      initials = names[0].slice(0, 2) + lastName[0];
    } else {
      initials = names[0].slice(0, 2);
    }
  }

  return initials.toUpperCase();
}
const colors = ["#FF5733", "#34A853", "#4285F4", "#FBBC05", "#EA4335"];
export const randomColor = colors[Math.floor(Math.random() * colors.length)];
