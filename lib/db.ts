import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import {
  and,
  eq,
  or,
  desc,
  asc,
  isNotNull,
  getTableColumns,
} from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

import * as Schemas from "@/drizzle/schema";
import assert from "assert";
import { defaultTeams } from "./types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.POSTGRES_URL!}`);
const db = drizzle(client);

// users ==========================================================================================

export async function getUserAccountByEmail(email: string) {
  return db
    .select({
      ...getTableColumns(Schemas.users1),
      ...getTableColumns(Schemas.accounts1),
    })
    .from(Schemas.accounts1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.accounts1.id))
    .where(eq(Schemas.accounts1.email, email));
}

export async function getUserAccountByPhone(phone: string) {
  return db
    .select({
      ...getTableColumns(Schemas.users1),
      ...getTableColumns(Schemas.accounts1),
    })
    .from(Schemas.accounts1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.accounts1.id))
    .where(eq(Schemas.accounts1.phone, phone));
}

export async function getUserByEmail(email: string) {
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id))
    .where(eq(Schemas.accounts1.email, email))
    .then((r) => r.at(0));
}

export async function getUserByPhone(phone: string) {
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id))
    .where(eq(Schemas.accounts1.phone, phone));
}

export async function getAllUsers() {
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
      email: Schemas.accounts1.email,
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id));
}

export async function createUserIfNotExists({
  name,
  phone,
  email,
  password,
}: {
  name: string;
  phone?: string;
  email: string;
  password: string;
}) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return db.transaction(async (tx) => {
    const newAccount = await tx
      .insert(Schemas.accounts1)
      .values({
        phone,
        email,
        password: hash,
      })
      .returning()
      .then((r) => r[0]);

    const newUser = await tx
      .insert(Schemas.users1)
      .values({
        id: newAccount.id,
        name,
      })
      .returning()
      .then((r) => r[0]);

    return newUser;
  });
}

export async function updateUserAvatar(
  uploaderid: number,
  values: { avatarUrl: string },
) {
  return await db.transaction(async (tx) => {
    const oldUser = await tx
      .select()
      .from(Schemas.users1)
      .where(eq(Schemas.users1.id, uploaderid))
      .then((r) => r[0]);
    const updatedUser = await tx
      .update(Schemas.users1)
      .set(values)
      .where(eq(Schemas.users1.id, uploaderid))
      .returning()
      .then((r) => r[0]);
    return {
      initial: oldUser,
      updated: updatedUser,
    };
  });
}

export async function deleteUserAvatar(uploaderId: number) {
  return await db.transaction(async (tx) => {
    const oldUser = await tx
      .select()
      .from(Schemas.users1)
      .where(eq(Schemas.users1.id, uploaderId))
      .then((r) => r[0]);

    if (!oldUser) {
      throw new Error(`User with ID ${uploaderId} not found`);
    }

    const updatedUser = await tx
      .update(Schemas.users1)
      .set({ avatarUrl: null })
      .where(eq(Schemas.users1.id, uploaderId))
      .returning()
      .then((r) => r[0]);

    return {
      initial: oldUser,
      updated: updatedUser,
    };
  });
}

// projects ==========================================================================================

export async function getUserProjects(userId: number, pagenum: number = 0) {
  const pagesize = 30;
  return await db
    .select({
      ...getTableColumns(Schemas.projects1),
      user: {
        ...getTableColumns(Schemas.users1),
      },
    })
    .from(Schemas.projects1)
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.projects1.userid))
    .where(eq(Schemas.projects1.userid, userId))
    .orderBy(desc(Schemas.projects1.id)) // created at?
    .limit(pagesize)
    .offset(pagesize * pagenum);
}

export async function getProject(projectId: number) {
  return await db
    .select()
    .from(Schemas.projects1)
    .where(and(eq(Schemas.projects1.id, projectId)))
    .then((r) => r.at(0));
}

export async function createProject(
  values: Omit<typeof Schemas.projects1.$inferInsert, "id">,
) {
  return await db
    .insert(Schemas.projects1)
    .values(values)
    .returning()
    .then((r) => r[0]);
}

export async function deleteProject(projectId: number) {
  return await db
    .delete(Schemas.projects1)
    .where(eq(Schemas.projects1.id, projectId))
    .returning();
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
  return await db
    .update(Schemas.projects1)
    .set(updates)
    .where(eq(Schemas.projects1.id, projectId))
    .returning()
    .then((r) => r[0]);
}

// project members ==========================================================================================

export async function createTeams(projectId: number, types: string[]) {
  const values = types.map((type) => {
    return { projectid: projectId, type };
  });
  return db.transaction(async (tx) => {
    const existingTeam = await tx.select()
      .from(Schemas.teams1)
      .where(eq(Schemas.teams1.projectid, projectId))
      .limit(1);
    if (existingTeam.length > 0) return;
    return tx.insert(Schemas.teams1).values(values).returning();
  });
}

export async function createTeam(projectId: number, type: string) {
  return db
    .insert(Schemas.teams1)
    .values({ projectid: projectId, type })
    .returning();
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
      .returning()
      .then((r) => r[0]);
  });
  return deletedTeam;
}

export async function getProjectTeams(projectId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.teams1),
      lead: getTableColumns(Schemas.users1),
    })
    .from(Schemas.teams1)
    .leftJoin(Schemas.users1, eq(Schemas.teams1.lead, Schemas.users1.id))
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

export async function setTeamLead(teamid: number, userid: number) {
  return db
    .update(Schemas.teams1)
    .set({ lead: userid })
    .where(eq(Schemas.teams1.id, teamid))
    .returning();
}

export async function addTeamMember(teamid: number, userid: number) {
  return db
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
    .select({ ...getTableColumns(Schemas.users1) })
    .from(Schemas.users1)
    .leftJoin(
      Schemas.teammembers1,
      eq(Schemas.teammembers1.userid, Schemas.users1.id),
    )
    .where(eq(Schemas.teammembers1.teamid, teamId));
}

export async function getTeamMembersDetailed(teamId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.users1),
      email: Schemas.accounts1.email,
    })
    .from(Schemas.users1)
    .leftJoin(Schemas.accounts1, eq(Schemas.accounts1.id, Schemas.users1.id))
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

export async function createProjectTasksFromAllSpecs(projectId: number) {
  return db.transaction(async (tx) => {
    const existingTasks = await tx
      .select()
      .from(Schemas.tasks1)
      .where(eq(Schemas.tasks1.projectid, projectId))
      .limit(1);
    if (existingTasks.length > 0) return; // or throw error?

    const specs = await tx.select().from(Schemas.taskspecs1);
    const tasks = specs.map((spec) => {
      return {
        specid: spec.id,
        projectid: projectId,
        type: spec.type,
        title: spec.title,
        description: spec.description,
        enabled: true,
      };
    });
    return await tx.insert(Schemas.tasks1).values(tasks).returning();
  });
}

export async function enableProjectTaskSpec(
  projectId: number,
  specId: number,
  enabled: boolean,
) {
  return await db
    .update(Schemas.tasks1)
    .set({ enabled })
    .where(
      and(
        eq(Schemas.tasks1.projectid, projectId),
        eq(Schemas.tasks1.specid, specId),
      ),
    )
    .returning()
    .then((r) => r[0]);
}

export async function enableProjectTask(taskId: number, enabled: boolean) {
  return await db
    .update(Schemas.tasks1)
    .set({ enabled })
    .where(eq(Schemas.tasks1.id, taskId))
    .returning()
    .then((r) => r[0]);
}

export async function getProjectTasksAll(projectid: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(and(eq(Schemas.tasks1.projectid, projectid)));
}

export async function getProjectTasks(projectid: number) {
  return await db
    .select()
    .from(Schemas.tasks1)
    .where(
      and(
        eq(Schemas.tasks1.projectid, projectid),
        eq(Schemas.tasks1.enabled, true),
      ),
    )
    .orderBy(Schemas.tasks1.id);
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

export async function addFile(
  values: Omit<typeof Schemas.files1._.inferInsert, "id">,
) {
  return await db
    .insert(Schemas.files1)
    .values(values)
    .returning()
    .then((r) => r[0]);
}

export async function getFilesForProject(projectId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.files1),
      uploader: {
        ...getTableColumns(Schemas.users1),
      },
      task: {
        ...getTableColumns(Schemas.tasks1),
      },
    })
    .from(Schemas.files1)
    .leftJoin(Schemas.tasks1, eq(Schemas.tasks1.id, Schemas.files1.taskid))
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderid))
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
    .select({
      ...getTableColumns(Schemas.taskcomments1),
      user: {
        ...getTableColumns(Schemas.users1),
      },
    })
    .from(Schemas.taskcomments1)
    .leftJoin(
      Schemas.users1,
      eq(Schemas.users1.id, Schemas.taskcomments1.userid),
    )
    .where(eq(Schemas.taskcomments1.taskid, taskid))
    .orderBy(asc(Schemas.taskcomments1.createdAt));
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

export async function getFilesForTask(taskId: number) {
  return await db
    .select({
      ...getTableColumns(Schemas.files1),
      uploader: {
        ...getTableColumns(Schemas.users1),
      },
      task: {
        ...getTableColumns(Schemas.tasks1),
      },
    })
    .from(Schemas.files1)
    .leftJoin(Schemas.tasks1, eq(Schemas.tasks1.id, Schemas.files1.taskid))
    .leftJoin(Schemas.users1, eq(Schemas.users1.id, Schemas.files1.uploaderid))
    .where(eq(Schemas.tasks1.id, taskId));
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

// OTP functions ==========================================================================================

// TODO what about email?
export async function saveOtp(
  phoneNumber: string,
  otp: string,
  expiresAt: Date,
) {
  // Define the rate limit time window (e.g., 5 seconds between requests)
  const RATE_LIMIT_WINDOW = 5 * 1000;

  // Get the current time
  const currentTime = new Date().getTime();

  // Use a transaction to ensure atomicity and consistency
  return await db.transaction(async (tx) => {
    // Check if there is an existing OTP for the phone number
    const existingOtp = await tx
      .select()
      .from(Schemas.otps1)
      .where(eq(Schemas.otps1.phoneNumber, phoneNumber))
      .limit(1);

    if (existingOtp.length > 0) {
      const lastOtpTimeValue = existingOtp[0].createdAt;

      // Ensure that lastOtpTimeValue is not null
      if (lastOtpTimeValue !== null) {
        const lastOtpTime = lastOtpTimeValue.getTime(); // Convert to Unix timestamp in milliseconds

        // Calculate the time difference
        const timeDifference = currentTime - lastOtpTime;

        // If the time difference is less than the rate limit window, throw an error
        if (timeDifference < RATE_LIMIT_WINDOW) {
          throw new Error(
            "OTP requests are too frequent. Please try again later.",
          );
        }

        // If allowed, delete the existing OTP (to be overwritten)
        await tx
          .delete(Schemas.otps1)
          .where(eq(Schemas.otps1.phoneNumber, phoneNumber));
      }
    }

    // Generate a salt and hash the OTP
    const salt = genSaltSync(10);
    const hashedOtp = hashSync(otp, salt);

    // Save the new OTP
    return await tx
      .insert(Schemas.otps1)
      .values({
        phoneNumber,
        otp: hashedOtp,
        expiresAt,
        createdAt: new Date(), // Save the current timestamp as an ISO string
      })
      .returning();
  });
}

export async function verifyOtp(
  phoneNumber: string,
  otp: string,
): Promise<boolean> {
  return await db.transaction(async (tx) => {
    // Retrieve the OTP record for the given phone number
    const record = await tx
      .select()
      .from(Schemas.otps1)
      .where(eq(Schemas.otps1.phoneNumber, phoneNumber))
      .limit(1);

    // If no record is found, return false
    if (record.length === 0) {
      return false;
    }

    const { otp: hashedOtp, expiresAt } = record[0];

    // Check if the OTP has expired
    if (new Date() > new Date(expiresAt)) {
      // If expired, delete the OTP record and return false
      await tx
        .delete(Schemas.otps1)
        .where(eq(Schemas.otps1.phoneNumber, phoneNumber));
      return false;
    }

    // Compare the provided OTP with the hashed OTP
    const isValidOtp = compareSync(otp, hashedOtp);

    // If the OTP is valid, delete the OTP record
    if (isValidOtp) {
      await tx
        .delete(Schemas.otps1)
        .where(eq(Schemas.otps1.phoneNumber, phoneNumber));
    }

    return isValidOtp;
  });
}
