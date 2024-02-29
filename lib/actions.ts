'use server';

import { createProject } from '@/lib/db';
import { auth } from './auth';
import { put } from '@vercel/blob';
import { z } from "zod"
import { NewProjectFormSchema } from './types';

export async function submitNewProject(info: string) {
  const session = await auth();
  if (!session?.user) {
    console.log("Can't submit a post without being logged in.");
    return null;
  }
  if (!session?.user?.id) {
    console.log("Invalid user.");
    return null;
  }
  return await createProject(Number(session.user.id), info);
}

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
  return submitNewProject(JSON.stringify(formDataFiltered));
}

export async function submitProjectForm2(info: string, files: any[]) {
  console.log("files", files);
  const projectId = submitNewProject(info);
  if (!projectId) {
    console.log("asdf");
    return null;
  }

  const { url } = await put('articles/blob.txt', 'Hello World!', {
    access: 'public',
  });
  console.log("uploaded to ", url);

}



export async function submitProjectForm3(formData: FormData) {

  const formObj = {
    ...Object.fromEntries(formData),
    files: formData.getAll('files')
  };

  const parsed = NewProjectFormSchema.safeParse(formObj);

  if (!parsed.success) {
    console.log("error", parsed.error);
  } else {
    console.log("data", parsed.data);
  }

  // const files = formData.getAll('files') as File[];
  // console.log(files);
  // const str = Buffer.from(await files.arrayBuffer()).toString('base64')
  // console.log(str);
}
