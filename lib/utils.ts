import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addTaskFile, updateAvatarForUser } from "./actions";
import { formatDistanceToNow } from "date-fns";

import { toast } from "@/components/ui/use-toast";

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

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export async function uploadProjectFile(
  file: File,
  projectId: number,
  specId: number,
  taskId: number,
) {
  const response = await fetch("/api/upload/project-files", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      projectId,
      specId,
    }),
  });

  const { url, fileUrl, fields } = await response.json();

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);

  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    return toast({ description: "Failed to upload file. Please try again." });
  }

  return addTaskFile(
    taskId,
    file.type,
    file.name,
    file.size,
    fileUrl,
    projectId,
  );
}

export async function uploadAvatar(file: File) {
  const response = await fetch("/api/upload/avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  const { url, fileUrl, fields } = await response.json();

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);

  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file");
  }

  return await updateAvatarForUser(fileUrl);
}
