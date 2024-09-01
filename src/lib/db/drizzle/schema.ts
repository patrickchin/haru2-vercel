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
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// pnpm drizzle-kit push
// pnpm drizzle-kit introspect
// pnpm drizzle-kit generate
// pnpm drizzle-kit migrate

export const accountRoleEnum = pgEnum("role", [
  "client",
  "designer",
  "manager",
  "admin",
]);

export const accounts1 = pgTable("accounts1", {
  id: serial("id").primaryKey(),
  password: varchar("password", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  phone: varchar("phone", { length: 32 }),
  phoneVerified: timestamp("phoneVerified", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  role: accountRoleEnum("role").default("client"),
});

export const users1 = pgTable("users1", {
  id: serial("id")
    .primaryKey()
    .references(() => accounts1.id),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: varchar("avatarUrl", { length: 255 }),
});

export const contacts1 = pgTable("contacts1", {
  id: serial("id")
    .primaryKey()
    .references(() => users1.id),
  contactId: serial("contactId").references(() => users1.id),
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
  lead: varchar("lead", { length: 255 }), // TODO deprecate replace with leadId
  // leadId: integer("leadId").references(() => users1.id),
  // owner: integer("ownerid").references(() => users1.id),
  // members: integer("ownerid").references(() => users1.id),
  type: varchar("type", { length: 255 }),
  status: varchar("status", { length: 255 }).default("pending"),
  startdate: date("startDate", { mode: "date" }),
  enddate: date("endDate", { mode: "date" }),
  estimation: integer("estimation"), // TODO deprecate
  duration: integer("duration"), // in days
  cost: integer("cost"),
  costUnits: char("costUnits", { length: 3 }), // ISO 4217

  title: varchar("title", { length: 255 }),
  description: text("description"),
  enabled: boolean("enabled").default(true),
  // updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// export const taskupdate1 = pgTable("taskupdate1", {
// })

export const commentSections1 = pgTable("commentSections1", {
  id: serial("id").primaryKey(),
  projectid: integer("projectId").references(() => projects1.id),
  taskid: integer("taskId").references(() => tasks1.id),
});

export const comments1 = pgTable("comments1", {
  id: serial("id").primaryKey(),
  sectionId: integer("sectionId").references(() => commentSections1.id),
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
  commentid: integer("commentId").references(() => comments1.id),
  filename: varchar("filename", { length: 255 }).notNull().default(""),
  filesize: integer("filesize"),
  url: varchar("url", { length: 255 }),
  type: varchar("type", { length: 255 }),
  uploadedat: timestamp("uploadedAt", { mode: "date" }).notNull().defaultNow(),
});

export const otps1 = pgTable("otps1", {
  id: serial("id").primaryKey().notNull(),
  contactInfo: varchar("contactInfo", { length: 32 }).notNull(),
  otp: varchar("otp", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
});

// TODO could move to a separate file:
// ============================== Site Analysis ==============================

export const sites1 = pgTable("sites1", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 1024 }),
  type: varchar("type", { length: 255 }),
  countryCode: char("countryCode", { length: 2 }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const siteDetails1 = pgTable("siteDetails1", {
  id: serial("id")
    .primaryKey()
    .references(() => sites1.id),
  address: text("address"),
  postcode: varchar("postcode", { length: 255 }),
  description: text("description"),
  extraInfo: jsonb("extraInfo"),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  nextReportDate: timestamp("nextReportDate"),

  // until something better is figured out with maybe temporary accounts ?
  managerName: varchar("managerName", { length: 256 }),
  managerPhone: varchar("managerPhone", { length: 256 }),
  managerEmail: varchar("managerEmail", { length: 256 }),
  contractorName: varchar("contractorName", { length: 256 }),
  contractorPhone: varchar("contractorPhone", { length: 256 }),
  contractorEmail: varchar("contractorEmail", { length: 256 }),
  supervisorName: varchar("supervisorName", { length: 256 }),
  supervisorPhone: varchar("supervisorPhone", { length: 256 }),
  supervisorEmail: varchar("supervisorEmail", { length: 256 }),
});

export const siteMemberRole = pgEnum("siteMemberRole", [
  "owner",
  "manager",
  "contractor",
  "supervisor",
  "member",
]);

export const siteMembers1 = pgTable("siteMembers1", {
  siteId: integer("siteId").references(() => sites1.id),
  memberId: integer("memberId").references(() => users1.id),
  role: siteMemberRole("role").default("member"),
});

export const siteReports1 = pgTable("siteReports1", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporterId").references(() => users1.id),
  siteId: integer("siteId").references(() => sites1.id),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const siteReportFiles1 = pgTable("siteReportFiles1", {
  reportId: integer("reportId").references(() => siteReports1.id),
  fileId: integer("filedId").references(() => files1.id),
});
