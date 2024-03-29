'use server';

import {
  addFileUrlToProject,
  createProject,
  deleteAllFilesFromProject,
  deleteProject,
  getFilesUrlsForProject
} from '@/lib/db';
import { auth } from './auth';
import { put } from '@vercel/blob';
import { NewProjectFormSchema } from './types';
import { redirect } from 'next/navigation';

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

  // not the prettiest ...
  const { files, ...projectInfo } = { ...parsed.data };
  const newProjectArr = await createProject({
    userid: userId,
    title: projectInfo.title,
    description: projectInfo.description,
    type: projectInfo.buildingType,
    subtype: projectInfo.buildingSubtype,
    countrycode: projectInfo.country,
    extrainfo: {
      lifestyle: projectInfo.lifestyle,
      future: projectInfo.future,
      energy: projectInfo.energy,
      outdoors: projectInfo.outdoors,
      security: projectInfo.security,
      maintenance: projectInfo.maintenance,
      special: projectInfo.special,
    }
  });
  if (newProjectArr.length != 1) {
    console.error("Failed to submit a new project post\n");
    return null;
  }

  const newProjectId = newProjectArr[0].id;

  // TODO client upload directly to server! 4.5 MB limit currently
  if (files) {
    for (const file of files) {

      // TODO hack
      // FormData constructor from event.target adds a file with no filename
      // ignore that file here
      // the improved file upload should not hit this error
      if (file.name == "undefined" && file.size == 0) {
        console.log("ignoring fake file from FormData constructor");
        continue;
      }

      const data = await file.arrayBuffer();
      // private access isn't supported by vercel atm
      const { url } = await put(`project/${newProjectId}/${file.name}`, data, { access: 'public', });
      console.log("file uploaded", file.name, url);

      // TODO optimise - await outside the loop?
      const newFileRow = await addFileUrlToProject({
        uploaderid: userId,
        projectid: newProjectId,
        filename: file.name,
        url: url,
        type: file.type
      });
      console.log(newFileRow.at(0)?.type);
    }
  }

  redirect(`/project/${newProjectId}`);
}

export async function getProjectFiles(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    console.log("Invalid session on get project files");
    return [];
  }
  const userId = Number(session.user.id);
  const fileUrls = await getFilesUrlsForProject(userId, projectId);
  return fileUrls;
}

export async function deleteFullProject(projectId: number) {
  // A lot more thought has to go into deleting projects.
  // - what happens if something fails in the middle?
  // - what happens if ... what else?

  console.log("DELETING PROJECT", projectId);

  const deletedFiles = await deleteAllFilesFromProject(projectId);
  deletedFiles.map((f) => console.log("TODO delete file from store", f));

  const deletedProject = await deleteProject(projectId);
  console.log("DELETED PROJECT", deletedProject);

  redirect('/projects');
}