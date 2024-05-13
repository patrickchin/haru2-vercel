import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq, or, desc, asc, isNotNull } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";

import * as Schemas from "drizzle/schema";
import assert from "assert";
import { DesignTeam, defaultTeams } from "./types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

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

export async function getProject(projectId: number) {
  return await db
    .select()
    .from(Schemas.projects1)
    .where(and(eq(Schemas.projects1.id, projectId)));
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
    status?: string;
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

// project members ==========================================================================================

export async function createTeams(projectid: number, types: string[]) {
  if (types.length === 0) return [];
  const values = types.map((type) => {
    return { projectid, type };
  });
  return await db.insert(Schemas.teams1).values(values).returning();
}

export async function deleteTeam(teamId: number) {
  const deletedTeam = await db.transaction(async (tx) => {
    await tx
      .delete(Schemas.teammembers1)
      .where(eq(Schemas.teammembers1.teamid, teamId))
      .returning();
    return await tx
      .delete(Schemas.teams1)
      .where(eq(Schemas.teams1.id, teamId))
      .returning();
  });
  return deletedTeam;
}

export async function getProjectTeams(projectId: number) {
  return await db
    .select()
    .from(Schemas.teams1)
    .where(eq(Schemas.teams1.projectid, projectId));
}

export async function getProjectTeamsEnsureDefault(projectId: number) {
  return db.transaction(async (tx) => {
    const teams = await tx
      .select()
      .from(Schemas.teams1)
      .where(eq(Schemas.teams1.projectid, projectId));
    if (teams.length > 0) return teams;

    const values = defaultTeams.map((teamType) => {
      return { projectid: projectId, type: teamType };
    });
    return tx.insert(Schemas.teams1).values(values).returning();
  });
}

export async function getTeamId(projectid: number, type: string) {
  // may
  return db
    .select()
    .from(Schemas.teams1)
    .where(
      and(
        eq(Schemas.teams1.projectid, projectid),
        eq(Schemas.teams1.type, type),
      ),
    );
}

export async function addTeamMember(teamid: number, userid: number) {
  return await db
    .insert(Schemas.teammembers1)
    .values({
      teamid,
      userid,
    })
    .onConflictDoNothing()
    .returning();
}

export async function deleteTeamMember(teamid: number, userid: number) {
  return await db
    .delete(Schemas.teammembers1)
    .where(
      and(
        eq(Schemas.teammembers1.teamid, teamid),
        eq(Schemas.teammembers1.userid, userid),
      ),
    )
    .returning();
}

export async function getTeamMembers(teamId: number) {
  return await db
    .select({
      name: Schemas.users1.name,
      email: Schemas.users1.email,
      avatarUrl: Schemas.users1.avatarUrl,
      avatarColor: Schemas.users1.avatarColor,
    })
    .from(Schemas.users1)
    .leftJoin(
      Schemas.teammembers1,
      eq(Schemas.teammembers1.userid, Schemas.users1.id),
    )
    .where(eq(Schemas.teammembers1.teamid, teamId));
}

// tasks ==========================================================================================

export async function createTaskSpecs(
  values: (typeof Schemas.taskspecs1.$inferInsert)[],
) {
  return await db
    .insert(Schemas.taskspecs1)
    .values(values)
    .onConflictDoNothing()
    .returning();
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
  values: Omit<typeof Schemas.files1._.inferInsert, "id">,
) {
  return await db.insert(Schemas.files1).values(values).returning();
}

export async function getFilesUrlsForProject(projectId: number) {
  // tbh this join isn't needed if we just attach projectId to the file
  return await db
    .select({
      // do i really gotta specify manually?
      id: Schemas.files1.id,
      uploaderid: Schemas.files1.uploaderid,
      projectid: Schemas.files1.projectid,
      taskid: Schemas.files1.taskid,
      commentid: Schemas.files1.commentid,
      filename: Schemas.files1.filename,
      filesize: Schemas.files1.filesize,
      url: Schemas.files1.url,
      type: Schemas.files1.type,
      // ...Schemas.files1._.columns, // this no work?
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
    .orderBy(asc(Schemas.taskcomments1.createdat));
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

export async function editTaskFile(
  fileId: number,
  values: Omit<typeof Schemas.files1._.inferInsert, "id">,
) {
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

export async function getTaskCommentAttachments(taskid: number) {
  return await db
    .select()
    .from(Schemas.files1)
    .where(
      and(
        eq(Schemas.files1.taskid, taskid),
        isNotNull(Schemas.files1.commentid),
      ),
    );
}

export async function deleteFile(fileId: number) {
  return db
    .delete(Schemas.files1)
    .where(eq(Schemas.files1.id, fileId))
    .returning();
}
