"use server";

import * as db from "@/lib/db";
import { auth } from "@/lib/auth";
import * as blob from "@vercel/blob";
import { defaultTeams } from "@/lib/types";
import { NewProjectFormSchema } from "@/lib/forms";
import { redirect } from "next/navigation";

export async function submitProjectForm2(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    console.log("Invalid session on project form submit");
    return;
  }
  const userId = Number(session.user.id); // error?

  const formObj = {
    ...Object.fromEntries(formData),
    files: formData.getAll("files"),
  };
  const parsed = NewProjectFormSchema.safeParse(formObj);
  if (!parsed.success) {
    console.error("submitProjectForm validation error", parsed.error);
    return;
  }

  // not the prettiest ...
  const {
    files,
    title,
    description,
    buildingType,
    buildingSubtype,
    country,
    ...extrainfo
  } = parsed.data;

  const project = await db.createProject({
    userid: userId,
    title,
    description,
    type: buildingType,
    subtype: buildingSubtype,
    countrycode: country,
    extrainfo,
  });

  Promise.all([
    db.createTeams(project.id, defaultTeams),
    db.createProjectTasksFromAllSpecs(project.id),
  ]);

  const results = Array.from(files ?? []).map(async (file) => {
    // HACK FormData constructor from event.target adds a file with no filename ignore that file here.
    if (file.name == "undefined" && file.size == 0) {
      console.log("ignoring fake file from FormData constructor");
      return Promise.resolve();
    }

    console.log(`uploading file "${file.name}"`);
    const data = await file.arrayBuffer();
    const { url, downloadUrl } = await blob.put(
      `project/${project.id}/${file.name}`,
      data,
      { access: "public" },
    );
    console.log(
      `file "${file.name}" uploaded to: ${url}\n` +
        `    and can be downloaded from: ${downloadUrl}`,
    );

    const newFileRow = await db.addFile({
      uploaderid: userId,
      projectid: project.id,
      filename: file.name,
      url: url,
      type: file.type,
    });
  });

  Promise.all(results).catch((e) => {
    console.error("Failed to upload all files.");
    console.log(e);
  });

  redirect(`/project/${project.id}`);
}

export async function getProject(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  const userId = Number(session.user.id);
  return await db.getProject(projectId);
}

export async function deleteFullProject(projectId: number) {
  // disable deletions for now
  return;

  // TODO needs more security
  const session = await auth();
  if (!session?.user?.id) return;

  // A lot more thought has to go into deleting projects.
  // - what happens if something fails in the middle?
  // - what happens if ... what else?

  console.log("DELETING PROJECT", projectId);

  const deletedFiles = await db.deleteAllFilesFromProject(projectId);
  deletedFiles.map((f) => {
    console.log("deleting file from store", f);
    if (f.url) blob.del(f.url);
  });

  const deletedProject = await db.deleteProject(projectId);
  console.log("DELETED PROJECT", deletedProject);

  redirect("/projects");
}

export async function startProject(projectId: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  await updateProject(projectId, { status: "in progress" });
}

export async function startProjectForm(data: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const projectId = data.get("projectId") as unknown as number;
  if (isNaN(projectId)) return;

  await startProject(projectId);

  redirect(`/project/${projectId}`);
}

//Update project title
export async function updateProjectTitle(projectId: number, newTitle: string) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("Invalid session on project form submit");
    return;
  }

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    console.error("User ID is not a number:", session.user.id);
    return;
  }

  const updatedProject = await db.updateProjectFields(projectId, {
    title: newTitle,
  });
  if (!updatedProject) {
    console.error("Failed to update project title.");
    return null;
  }
  return updatedProject;
}

export async function getCurrentUsersProjects() {
  const session = await auth();
  if (session?.user?.id)
    // linter is stupid
    return db.getUserProjects(parseInt(session.user.id));
}

//update any field of the project
export async function updateProject(
  projectId: number,
  updates: Record<string, any>,
) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("Invalid session on project form submit");
    return null;
  }

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    console.error("User ID is not a number:", session.user.id);
    return null;
  }

  const updatedProject = await db.updateProjectFields(projectId, updates);
  if (!updatedProject) {
    console.error("Failed to update project title.");
    return null;
  }
  return updatedProject;
}
