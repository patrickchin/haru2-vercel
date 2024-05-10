import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarInitials(fullName: string) {
  const names = fullName.trim().split(/\s+/);
  let initials = "";

  if (names.length === 1) {
    // If there's only one name, use the first and last character of this name
    initials =
      names[0][0] +
      (names[0].length > 1 ? names[0][names[0].length - 1] : names[0][0]);
  } else {
    // Use the first character of the first name and the last character of the last name
    initials =
      names[0][0] + names[names.length - 1][names[names.length - 1].length - 1];
  }

  // Convert initials to uppercase
  return initials.toUpperCase();
}
