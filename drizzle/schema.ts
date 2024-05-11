import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  json,
  char,
  date,
  boolean,
  unique,
} from "drizzle-orm/pg-core";

// pnpm drizzle-kit push:pg
// pnpm drizzle-kit introspect:pg
// pnpm drizzle-kit generate:pg
// pnpm tsx drizzle/migrate.ts

export const users1 = pgTable("users1", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  old1phone: varchar("phone", { length: 16 }), // deprecated
  phone: varchar("phone1", { length: 32 }),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  avatarUrl: varchar("avatarUrl", { length: 255 }),
  avatarColor: varchar("avatarColor", { length: 12 }), // color hex code
});

export const projects1 = pgTable("projects1", {
  id: serial("id").primaryKey().notNull(),
  userid: integer("userId").references(() => users1.id),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  type: varchar("type", { length: 64 }),
  subtype: varchar("subtype", { length: 64 }),
  countrycode: char("countryCode", { length: 2 }),
  status: varchar("status", { length: 128 }).default("pending"),
  extrainfo: json("info").notNull(),
  createdat: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

// can this be indexed and referenced by (projectid, type) rather than having .id?
export const teams1 = pgTable("teams1", {
  id: serial("id").primaryKey().notNull(),
  // name: varchar("name", { length: 64 }),
  projectid: integer("projectId").references(() => projects1.id),
  type: varchar("type", { length: 64 }), // legal, architectural, structural, mep
  lead: integer("leadId").references(() => users1.id),
});

export const teammembers1 = pgTable(
  "teammembers1",
  {
    teamid: integer("teamId").references(() => teams1.id),
    userid: integer("userId").references(() => users1.id),
  },
  (t) => ({
    unq: unique().on(t.teamid, t.userid),
  }),
);

export const taskspecs1 = pgTable("taskspecs1", {
  id: serial("id").primaryKey().notNull(),
  type: varchar("type", { length: 255 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  // default duration
});

export const tasks1 = pgTable("tasks1", {
  id: serial("id").primaryKey().notNull(),
  specid: integer("specId").references(() => taskspecs1.id),
  projectid: integer("projectId").references(() => projects1.id),
  lead: varchar("lead", { length: 255 }),
  // owner: integer("ownerid").references(() => users1.id),
  // members: integer("ownerid").references(() => users1.id),
  type: varchar("type", { length: 255 }),
  status: varchar("status", { length: 255 }).default("pending"),
  startdate: date("startDate", { mode: "date" }),
  enddate: date("endDate", { mode: "date" }),
  estimation: integer("estimation"), // in days
  title: varchar("title", { length: 255 }),
  description: text("description"),
  enabled: boolean("enabled").default(true),
  // updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// export const taskupdate1 = pgTable("taskupdate1", {
// })

export const taskcomments1 = pgTable("taskcomments1", {
  id: serial("id").primaryKey().notNull(),
  taskid: integer("taskId").references(() => tasks1.id),
  userid: integer("userId").references(() => users1.id),
  createdat: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  comment: text("comment"),
});

export const files1 = pgTable("files1", {
  id: serial("id").primaryKey().notNull(),
  uploaderid: integer("uploaderId").references(() => users1.id),
  projectid: integer("projectId").references(() => projects1.id),
  taskid: integer("taskId").references(() => tasks1.id),
  commentid: integer("commentid").references(() => taskcomments1.id),
  filename: varchar("filename", { length: 255 }).notNull().default(""),
  filesize: integer("filesize"),
  url: varchar("url", { length: 255 }),
  type: varchar("type", { length: 255 }),
});
