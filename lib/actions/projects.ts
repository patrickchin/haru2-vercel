"use server";
import * as db from "@/lib/db";
import { Session } from "next-auth";
import "@/lib/auth";
import { auth } from "@/lib/auth";
import * as blob from "@vercel/blob";
import { DesignProject, defaultTeams } from "@/lib/types";
import { NewProjectFormSchema } from "@/lib/forms";
import { redirect } from "next/navigation";

export async function submitProjectForm2(formData: FormData) {
  const session = await auth();
  if (!session?.user) return; 
  const userId = session.user.idn;

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

function canViewProject(session?: Session | null, project?: DesignProject) {
  if (!project) return false;
  if (!session) return false;
  if (!session.user) return false;
  const isOwner = project?.userid === session.user.idn;
  switch (session.user.role) {
    case "client": return isOwner;
    case "designer": return true; // TODO only if my project manager is my manager
    case "manager": return true;
    case "admin": return true;
  }
}

function canEditProject(session?: Session | null, project?: DesignProject) {
  if (!project) return false;
  if (!session) return false;
  if (!session.user) return false;
  const isOwner = project?.userid === session.user.idn;
  switch (session.user.role) {
    case "client": return isOwner;
    case "designer": return false;
    case "manager": return true;
    case "admin": return true;
  }
}

export async function getProject(projectId: number) {
  const session = await auth();
  const project = await db.getProject(projectId);
  if (canViewProject(session, project))
    return project;
}

export async function getCurrentUsersProjects() {
  const session = await auth();
  if (!session?.user) return;
  return db.getUserProjects(session.user.idn);
}

export async function startProjectForm(data: FormData) {
  // calls another action so auth not necessary
  const projectId = data.get("projectId") as unknown as number;
  if (isNaN(projectId)) return;
  const updated = await updateProject(projectId, { status: "in progress" });
  if (updated) redirect(`/project/${projectId}`);
}

//update any field of the project
export async function updateProject(
  projectId: number,
  updates: Record<string, any>,
) {
  const session = await auth();
  const project = await db.getProject(projectId);
  if (canEditProject(session, project))
    return await db.updateProjectFields(projectId, updates);
}

export async function deleteFullProject(projectId: number) {
  // disable deletions for now
  return;

  const session = await auth();
  if (session?.user?.role !== "admin")

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