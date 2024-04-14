'use server';

import * as db from '@/lib/db';
import { auth } from './auth';
import * as blob  from '@vercel/blob';
import { NewProjectFormSchema } from './types';
import { redirect } from 'next/navigation';
import { defaulTaskSpecs, defaultDesignTasks } from './tasks';

const ENABLE_VERCEL_BLOB = false;

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
  const {
    files,
    title, description, buildingType, buildingSubtype, country,
    lifestyle, future, energy, outdoors, security, maintenance, special,
  } = parsed.data;

  const newProjectArr = await db.createProject({
    userid: userId,
    title,
    description,
    type: buildingType,
    subtype: buildingSubtype,
    countrycode: country,
    extrainfo: { lifestyle, future, energy, outdoors, security, maintenance, special }
  });
  if (newProjectArr.length != 1) {
    console.error("Failed to submit a new project post");
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
      // TODO use all the data
      const { url } = ENABLE_VERCEL_BLOB ?
        // private access isn't supported by vercel atm
        await blob.put(`project/${newProjectId}/${file.name}`, data, { access: 'public', }) :
        { url: "/tmp/demofloorplan.png" };
      console.log(`file "${file.name}" uploaded to: ${url} (ENABLE_VERCEL_BLOB ${ENABLE_VERCEL_BLOB})`);

      // TODO optimise - await outside the loop?
      const newFileRow = await db.addFileUrlToProject({
        uploaderid: userId,
        projectid: newProjectId,
        filename: file.name,
        url: url,
        type: file.type
      });
      console.log(newFileRow.at(0)?.type);
    }
  }

  // TASKS
  ;

  redirect(`/project/${newProjectId}`);
}

export async function getProject(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  const userId = Number(session.user.id);
  const projects = await db.getUserProject(userId, projectId);
  if (projects.length <= 0) return undefined;
  return projects[0];
}

export async function deleteFullProject(projectId: number) {

  // TODO needs more security
  const session = await auth();
  if (!session?.user?.id) return;
  
  // A lot more thought has to go into deleting projects.
  // - what happens if something fails in the middle?
  // - what happens if ... what else?

  console.log("DELETING PROJECT", projectId);

  const deletedFiles = await db.deleteAllFilesFromProject(projectId);
  deletedFiles.map((f) => {
    console.log("deleting file from store", ENABLE_VERCEL_BLOB, f);
    if (ENABLE_VERCEL_BLOB)
      blob.del(f.url)
  });

  const deletedProject = await db.deleteProject(projectId);
  console.log("DELETED PROJECT", deletedProject);

  redirect('/projects');
}

export async function getProjectFiles(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  const userId = Number(session.user.id);
  const fileUrls = await db.getFilesUrlsForProject(userId, projectId);
  return fileUrls;
}

export async function getProjectTasks(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  // const userId = Number(session.user.id);
  // TODO check user permissions
  const tasks = await db.getProjectTasks(projectId);
  return tasks;
}

export async function TMPgetProjectTasksOrDefault(projectId: number) {
  const tasks = await getProjectTasks(projectId);
  if (!tasks) return;
  if (tasks.length === 0) return defaultDesignTasks;
  return tasks;
}

export async function getProjectTask(projectId: number, specId: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  const tasks = await db.getProjectTask(projectId, specId);
  if (tasks.length <= 0) return;
  return tasks[0];
}

export async function TMPgetProjectTaskOrDefault(projectId: number, specId: number) {
  const task = await getProjectTask(projectId, specId);
  if (!task) return defaultDesignTasks.find((t) => t.specid == specId)
    return task;
}

export async function getTaskSpec(specId: number | null) {
  if (specId === null) return;
  const specs = await db.getTaskSpec(specId);
  if (specs.length <= 0) return;
  return specs[0];
}

export async function TMPgetTaskSpecOrDefault(specId: number | null) {
  if (specId === null) return;
  const spec = await getTaskSpec(specId);
  if (!spec) return defaulTaskSpecs.find((s) => s.id == specId);
  return spec;
}