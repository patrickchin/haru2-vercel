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
  primaryKey,
} from "drizzle-orm/pg-core";

// pnpm drizzle-kit push
// pnpm drizzle-kit introspect
// pnpm drizzle-kit generate
// pnpm drizzle-kit migrate

export const accounts1 = pgTable("accounts1", {
  id: serial("id").primaryKey(),
  password: varchar("password", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  phone: varchar("phone", { length: 32 }),
  phoneVerified: timestamp("phoneVerified", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const users1 = pgTable("users1", {
  id: serial("id").primaryKey().references(() => accounts1.id),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: varchar("avatarUrl", { length: 255 }),
});

export const projects1 = pgTable("projects1", {
  id: serial("id").primaryKey(),
  userid: integer("userId").references(() => users1.id),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  type: varchar("type", { length: 64 }),
  subtype: varchar("subtype", { length: 64 }),
  countrycode: char("countryCode", { length: 2 }),
  status: varchar("status", { length: 128 }).default("pending"),
  extrainfo: json("info"),
  createdat: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const teams1 = pgTable("teams1", {
  id: serial("id").primaryKey(),
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
  (t) => {
    return {
      unq: unique().on(t.teamid, t.userid),
      // drizzle can't changing primary key automatically it seems
      // pk: primaryKey({ columns: [t.teamid, t.userid], }),
    };
  },
);

export const taskspecs1 = pgTable("taskspecs1", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 255 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  // default duration
});

export const tasks1 = pgTable("tasks1", {
  id: serial("id").primaryKey(),
  specid: integer("specId").references(() => taskspecs1.id),
  projectid: integer("projectId").references(() => projects1.id),
  lead: varchar("lead", { length: 255 }),
  // lead1: integer("leadId").references(() => users1.id),
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
  id: serial("id").primaryKey(),
  taskid: integer("taskId").references(() => tasks1.id),
  userid: integer("userId").references(() => users1.id),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  comment: text("comment"),
});

export const files1 = pgTable("files1", {
  id: serial("id").primaryKey(),
  uploaderid: integer("uploaderId").references(() => users1.id),
  projectid: integer("projectId").references(() => projects1.id),
  taskid: integer("taskId").references(() => tasks1.id),
  commentid: integer("commentid").references(() => taskcomments1.id),
  filename: varchar("filename", { length: 255 }).notNull().default(""),
  filesize: integer("filesize"),
  url: varchar("url", { length: 255 }),
  type: varchar("type", { length: 255 }),
});

export const otps1 = pgTable("otps1", {
  id: serial("id").primaryKey().notNull(),
  phoneNumber: varchar("phoneNumber", { length: 32 }).notNull(),
  otp: varchar("otp", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});