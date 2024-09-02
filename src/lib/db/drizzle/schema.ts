import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  json,
  char,
  date,
  boolean,
  unique,
  pgEnum,
  jsonb,
  primaryKey,
  numeric,
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
  password: varchar("password"),
  email: varchar("email").unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  phone: varchar("phone"),
  phoneVerified: timestamp("phoneVerified", {
    mode: "date",
    withTimezone: true,
  }),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  role: accountRoleEnum("role").default("client"),
});

export const users1 = pgTable("users1", {
  id: serial("id")
    .primaryKey()
    .references(() => accounts1.id),
  name: varchar("name").notNull(),
  avatarUrl: varchar("avatarUrl"),
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
  title: varchar("title"),
  description: varchar("description"),
  type: varchar("type"),
  subtype: varchar("subtype"),
  countrycode: varchar("countryCode"),
  status: varchar("status").default("pending"),
  extrainfo: json("info"),
  createdat: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const teams1 = pgTable("teams1", {
  id: serial("id").primaryKey(),
  // name: varchar("name"),
  projectid: integer("projectId").references(() => projects1.id),
  type: varchar("type"), // legal, architectural, structural, mep
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
  type: varchar("type"),
  title: varchar("title"),
  description: varchar("description"),
  // default duration
});

export const tasks1 = pgTable("tasks1", {
  id: serial("id").primaryKey(),
  specid: integer("specId").references(() => taskspecs1.id),
  projectid: integer("projectId").references(() => projects1.id),
  lead: varchar("lead"), // TODO deprecate replace with leadId
  // leadId: integer("leadId").references(() => users1.id),
  // owner: integer("ownerid").references(() => users1.id),
  // members: integer("ownerid").references(() => users1.id),
  type: varchar("type"),
  status: varchar("status").default("pending"),
  startdate: date("startDate", { mode: "date" }),
  enddate: date("endDate", { mode: "date" }),
  estimation: integer("estimation"), // TODO deprecate
  duration: integer("duration"), // in days
  cost: integer("cost"),
  costUnits: varchar("costUnits"), // ISO 4217

  title: varchar("title"),
  description: varchar("description"),
  enabled: boolean("enabled").default(true),
  // updated: timestamp("updated", {
  //   withTimezone: true,
  //   mode: "date",
  // }).defaultNow(),
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
    mode: "date",
  }).defaultNow(),
  comment: varchar("comment"),
});

export const files1 = pgTable("files1", {
  id: serial("id").primaryKey(),

  // TODO deprecate in favour of fileGroups1
  uploaderid: integer("uploaderId").references(() => users1.id),
  // TODO deprecate in favour of fileGroups1
  projectid: integer("projectId").references(() => projects1.id),
  // TODO deprecate in favour of fileGroups1
  taskid: integer("taskId").references(() => tasks1.id),
  // TODO deprecate in favour of fileGroups1
  commentid: integer("commentId").references(() => comments1.id),

  filename: varchar("filename"),
  filesize: integer("filesize"),
  url: varchar("url"),
  type: varchar("type"),
  uploadedat: timestamp("uploadedAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const fileGroups1 = pgTable("fileGroups1", {
  id: serial("id").primaryKey(),
});

export const fileGroupFiles1 = pgTable(
  "fileGroupFiles1",
  {
    fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
    fileId: integer("fileId").references(() => files1.id),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.fileGroupId, t.fileId] }),
    };
  },
);

export const otps1 = pgTable("otps1", {
  id: serial("id").primaryKey().notNull(),
  contactInfo: varchar("contactInfo").notNull(),
  otp: varchar("otp").notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  expiresAt: timestamp("expiresAt", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

// TODO could move to a separate file:
// ============================== Site Analysis ==============================

export const sites1 = pgTable("sites1", {
  id: serial("id").primaryKey(),
  title: varchar("title"),
  type: varchar("type"),
  countryCode: char("countryCode"),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const siteDetails1 = pgTable("siteDetails1", {
  id: serial("id")
    .primaryKey()
    .references(() => sites1.id),
  address: varchar("address"),
  postcode: varchar("postcode"),
  description: varchar("description"),
  extraInfo: jsonb("extraInfo"),

  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  startDate: timestamp("startDate", { mode: "date", withTimezone: true }),
  endDate: timestamp("endDate", { mode: "date", withTimezone: true }),
  nextReportDate: timestamp("nextReportDate", {
    mode: "date",
    withTimezone: true,
  }),

  budget: numeric("budget"),
  budgetUnits: varchar("budgetUnits"),

  // until something better is figured out with maybe temporary accounts ?
  managerName: varchar("managerName"),
  managerPhone: varchar("managerPhone"),
  managerEmail: varchar("managerEmail"),
  contractorName: varchar("contractorName"),
  contractorPhone: varchar("contractorPhone"),
  contractorEmail: varchar("contractorEmail"),
  supervisorName: varchar("supervisorName"),
  supervisorPhone: varchar("supervisorPhone"),
  supervisorEmail: varchar("supervisorEmail"),
});

export const siteMemberRole = pgEnum("siteMemberRole", [
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
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  visitDate: timestamp("visitDate", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

// export const siteReportDetails1 = pgTable("siteReportDetails1", {
//   id: serial("id").primaryKey().references(() => siteReports1.id),
//   activities: varchar("activities"),
//   issues: varchar("issues"),
//   interactions: varchar("interactions"),
// });

// export const siteReportSections1 = pgTable("siteReportSections1", {
//   id: serial("id").primaryKey(),
//   reportId: integer("reportId").references(() => siteReports1.id),
//   title: varchar("title"),
//   content: varchar("content"),
//   fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
// });

// TODO deprecate replace with fileGroups1
export const siteReportFiles1 = pgTable("siteReportFiles1", {
  reportId: integer("reportId").references(() => siteReports1.id),
  fileId: integer("filedId").references(() => files1.id),
});
