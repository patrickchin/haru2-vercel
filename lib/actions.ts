'use server';

import { addFileUrlToProject, createProject, getFilesUrlsForProject, getImageUrlsForProject, getUserProject } from '@/lib/db';
import { auth } from './auth';
import { put } from '@vercel/blob';
import { NewProjectFormSchema } from './types';
import { redirect } from 'next/navigation';


export async function submitProjectForm(formData: FormData) {
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
  if (!session?.user?.id) {
    console.log("Invalid session on project form submit");
    return null;
  }
  const userId = Number(session.user.id); // error?

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
  const newProjectArr = await createProject(userId, projectInfo);
  if (newProjectArr.length != 1) {
    console.error("Failed to submit a new project post\n");
    return null;
  }

  const newProjectId = newProjectArr[0].id;

  // TODO client upload directly to server! 4.5 MB limit currently
  if (files) {
    for (const file of files) {
      const filename = file.name; // TODO sanitize? as this is user input
      const { url } = await put(`project/${newProjectId}/${filename}`,
        await file.arrayBuffer(), { access: 'public', });
      console.log("file uploaded", file.name, url);

      // TODO optimise - await outside the loop?
      const newFileRow = await addFileUrlToProject(userId, newProjectId, url, file.type);
      console.log(newFileRow.at(0)?.type);
    }
  }

  redirect(`/project/${newProjectId}`);
}

export async function getProjectFiles(projectId: number, imagesOnly: boolean) {

  const session = await auth();
  if (!session?.user?.id) {
    console.log("Invalid session on project form submit");
    return [];
  }
  const userId = Number(session.user.id);

  // this checks that user owns this project, kinda
  const project = getUserProject(userId, projectId);
  if (!project) {
    console.log("User project not found when getting project files");
    return [];
  }

  // const fileUrls = await getFilesUrlsForProject(projectId, );
  const imageUrlRows = await getImageUrlsForProject(projectId);
  const urls: string[] = imageUrlRows.map(o => o?.url as string);
  console.log("project image files", urls);
  return urls;
}