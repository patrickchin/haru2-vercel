'use server';

import { createProject } from '@/lib/db';
import { auth } from './auth';
import { put } from '@vercel/blob';
import { NewProjectFormSchema } from './types';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


export async function submitProjectForm(formData: FormData) {
  console.log(formData.get('files'));
  const formDataFiltered = {
    title: formData.get('title'),
    type: formData.get('type'),
    country: formData.get('country'),
    lifestyle: formData.get('lifestyle'),
    future: formData.get('future'),
    budget: formData.get('budget'),
    energy: formData.get('energy'),
    technology: formData.get('technology'),
    outdoors: formData.get('outdoors'),
    security: formData.get('security'),
    maintenance: formData.get('maintenance'),
    special: formData.get('special'),
  };

  const session = await auth();
  if (!session?.user) {
    console.log("Can't submit a post without being logged in.");
    return null;
  }
  if (!session?.user?.id) {
    console.log("Invalid user.");
    return null;
  }
  return await createProject(Number(session.user.id), formDataFiltered);
}


export async function submitProjectForm2(formData: FormData) {

  const session = await auth();
  if (!session?.user) {
    console.error("submitProjectForm Can't submit a post without being logged in.");
    return null;
  }
  if (!session?.user?.id) {
    console.error("submitProjectForm Invalid user.");
    return null;
  }

  const formObj = {
    ...Object.fromEntries(formData),
    files: formData.getAll('files')
  };
  const parsed = NewProjectFormSchema.safeParse(formObj);
  if (!parsed.success) {
    console.error("submitProjectForm validation error", parsed.error);
    return null;
  }

  const { files, ...projectInfo } = { ...parsed.data }
  const newProjectArr = await createProject(Number(session.user.id), projectInfo);
  if (newProjectArr.length != 1) {
    console.error("Failed to submit a new project post\n");
    return null;
  }

  const newProjectId = newProjectArr[0].id;

  if (files) {
    for (const file of files) {
      const filename = file.name; // TODO sanitize? as this is user input
      const { url } = await put(`project/${newProjectId}/${filename}`,
        await file.arrayBuffer(), { access: 'public', });
      console.log("file uploaded", file, url);
    }
  }

  console.log("redirecting to new project page");
  revalidatePath("/new-project");
  revalidatePath("/new-project2");
  redirect(`/project/${newProjectId}`);
}
