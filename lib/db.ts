import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq, or, desc } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";

import * as Schemas from "drizzle/schema";
import assert from "assert";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
export const db = drizzle(client);

// users ==========================================================================================

export async function getUser(email: string) {
  return await db
    .select()
    .from(Schemas.users1)
    .where(eq(Schemas.users1.email, email));
}

export async function createUser(
  name: string,
  phone: string,
  email: string,
  password: string,
) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db
    .insert(Schemas.users1)
    .values({ name, phone, email, password: hash });
}

// projects ==========================================================================================

export async function getUserProjects(userId: number, pagenum: number = 0) {
  const pagesize = 30;
  // TODO maybe don't select things like password and createdat ...
  // TODO make a view
  return await db
    .select()
    .from(Schemas.projects1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.projects1.userid))
    .where(eq(Schemas.projects1.userid, userId))
    .orderBy(desc(Schemas.projects1.id)) // created at?
    .limit(pagesize)
    .offset(pagesize * pagenum);
}

export async function getUserProject(userId: number, projectId: number) {
  return await db
    .select()
    .from(Schemas.projects1)
    .where(
      and(
        eq(Schemas.projects1.userid, userId),
        eq(Schemas.projects1.id, projectId),
      ),
    );
}

export async function createProject(values: {
  userid: number;
  title: string;
  description: string;
  type: string;
  subtype: string | undefined;
  countrycode: string;
  extrainfo: any;
}) {
  return await db.insert(Schemas.projects1).values(values).returning();
}

export async function deleteProject(projectId: number) {
  return await db
    .delete(Schemas.projects1)
    .where(eq(Schemas.projects1.id, projectId))
    .returning();
}
//Update the title
export async function updateTitle(projectId: number, newTitle: string) {
  const updatedProject = await db
    .update(Schemas.projects1)
    .set({ title: newTitle })
    .where(eq(Schemas.projects1.id, projectId))
    .returning();

  assert(
    updatedProject.length === 1,
    "Expected exactly one project to be updated",
  );
  return updatedProject[0];
}
//update any fields of project
export async function updateProjectFields(
  projectId: number,
  updates: {
    title?: string;
    description?: string;
    type?: string;
    subtype?: string;
    countrycode?: string;
    extrainfo?: any;
  },
) {
  const updatedProject = await db
    .update(Schemas.projects1)
    .set(updates)
    .where(eq(Schemas.projects1.id, projectId))
    .returning();

  assert(
    updatedProject.length === 1,
    "Expected exactly one project to be updated",
  );

  return updatedProject[0];
}
// tasks ==========================================================================================

export async function createTaskSpecs(
  values: (typeof Schemas.taskspecs1.$inferInsert)[],
) {
  return await db.insert(Schemas.taskspecs1).values(values).returning();
}

export async function TMPdeleteTaskSpecs() {
  return await db.delete(Schemas.taskspecs1);
}

export async function getTaskSpecs() {
  return await db.select().from(Schemas.taskspecs1);
}

export async function getTaskSpec(specid: number) {
  return await db
    .select()
    .from(Schemas.taskspecs1)
    .where(eq(Schemas.taskspecs1.id, specid))
    .limit(1);
}

export async function createProjectTasks(
  values: (typeof Schemas.tasks1.$inferInsert)[],
) {
  return await db.insert(Schemas.tasks1).values(values).returning();
}

export async function getProjectTasks(projectid: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(eq(Schemas.tasks1.projectid, projectid));
}

export async function getProjectTask(projectid: number, specid: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectid, projectid),
        eq(Schemas.tasks1.specid, specid),
      ),
    );
}

// files ==========================================================================================

export async function addFileUrlToProject(
  values: typeof Schemas.files1._.inferInsert,
) {
  return await db.insert(Schemas.files1).values(values).returning();
}

export async function getFilesUrlsForProject(projectId: number) {
  // is there a better way to handle the return values of joins?
  return await db
    .select({
      id: Schemas.files1.id,
      uploaderid: Schemas.files1.uploaderid,
      projectid: Schemas.files1.projectid,
      type: Schemas.files1.type,
      taskid: Schemas.files1.taskid,
      filename: Schemas.files1.filename,
      url: Schemas.files1.url,
    })
    .from(Schemas.files1)
    .leftJoin(Schemas.tasks1, eq(Schemas.tasks1.id, Schemas.files1.taskid))
    .where(
      or(
        eq(Schemas.files1.projectid, projectId),
        eq(Schemas.tasks1.projectid, projectId),
      ),
    );
}

export async function deleteAllFilesFromProject(projectId: number) {
  return await db
    .delete(Schemas.files1)
    .where(eq(Schemas.files1.projectid, projectId))
    .returning();
}

// comments ==========================================================================================

export async function getTaskComment(commentid: number) {
  return await db
    .select()
    .from(Schemas.taskcomments1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.taskcomments1.userid),
    )
    .where(eq(Schemas.taskcomments1.id, commentid));
}

export async function getTaskComments(taskid: number, pagenum: number = 0) {
  const pagesize = 10;
  return await db
    .select()
    .from(Schemas.taskcomments1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.taskcomments1.userid),
    )
    .where(eq(Schemas.taskcomments1.taskid, taskid))
    .orderBy(desc(Schemas.taskcomments1.createdat));
  // .limit(pagesize).offset(pagesize * pagenum)
}

export async function addTaskComment(
  values: typeof Schemas.taskcomments1._.inferInsert,
) {
  return await db.insert(Schemas.taskcomments1).values(values).returning();
}

export async function addTaskFile(values: typeof Schemas.files1._.inferInsert) {
  const newFiles = await db.insert(Schemas.files1).values(values).returning();
  assert(newFiles.length == 1);
  return newFiles[0];
}

export async function editTaskFile(fileId: number, values: { url: string }) {
  const editedFiles = await db
    .update(Schemas.files1)
    .set(values)
    .where(eq(Schemas.files1.id, fileId))
    .returning();
  assert(editedFiles.length == 1);
  return editedFiles[0];
}

export async function getTaskFiles(taskid: number) {
  return await db
    .select()
    .from(Schemas.files1)
    .where(eq(Schemas.files1.taskid, taskid));
  // .orderBy(desc(Schemas.files1.createdat));
}
