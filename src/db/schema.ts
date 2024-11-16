import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  unique,
  pgEnum,
  jsonb,
  numeric,
  interval,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

// pnpm drizzle-kit push
// pnpm drizzle-kit introspect
// pnpm drizzle-kit generate
// pnpm drizzle-kit migrate

export const accountRoleEnum = pgEnum("role", [
  "client",
  "manager",
  "supervisor",
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
  phone: varchar("phone").unique(),
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

export const files1 = pgTable("files1", {
  id: serial("id").primaryKey(),
  uploaderId: integer("uploaderId").references(() => users1.id),

  filename: varchar("filename"),
  filesize: integer("filesize"),
  url: varchar("url"),
  type: varchar("type"),
  uploadedAt: timestamp("uploadedAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),

  deletedAt: timestamp("deletedAt", { mode: "date", withTimezone: true }),
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
      uniq: unique().on(t.fileGroupId, t.fileId),
      // pk: primaryKey({ columns: [t.fileGroupId, t.fileId] }),
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
  countryCode: varchar("countryCode"),
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

  startDate: timestamp("startDate", { mode: "date", withTimezone: true }),
  endDate: timestamp("endDate", { mode: "date", withTimezone: true }),
  nextReportDate: timestamp("nextReportDate", {
    mode: "date",
    withTimezone: true,
  }),
  schedule: varchar("schedule"),

  budget: numeric("budget"),
  budgetUnits: varchar("budgetUnits"),

  // until something better is figured out with maybe temporary accounts ?
  ownerName: varchar("ownerName"),
  ownerPhone: varchar("ownerPhone"),
  ownerEmail: varchar("ownerEmail"),
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
  "owner",
  "manager",
  "contractor",
  "supervisor",
  "member",
]);

export const siteMembers1 = pgTable(
  "siteMembers1",
  {
    siteId: integer("siteId").references(() => sites1.id),
    memberId: integer("memberId").references(() => users1.id),
    role: siteMemberRole("role").default("member"),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.siteId, t.memberId] }),
    };
  },
);

export const siteMeetingStatus = pgEnum("siteMeetingStatus", [
  "pending",
  "rejected",
  "confirmed",
  "cancelled",
]);

export const siteMeetings1 = pgTable("siteMeetings1", {
  id: serial("id").primaryKey(),
  siteId: integer("siteId").references(() => sites1.id),
  userId: integer("userId").references(() => users1.id),
  status: siteMeetingStatus("status").default("pending"),
  date: timestamp("date", { mode: "date", withTimezone: true }),
  duration: interval("duration"),
  notes: varchar("notes"),
  url: varchar("url"),
});

export const siteNotices1 = pgTable("siteNotices1", {
  id: serial("id").primaryKey(),
  siteId: integer("siteId").references(() => sites1.id),
  resolved: boolean("resolved"),
  description: varchar("description"),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const siteReports1 = pgTable("siteReports1", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporterId").references(() => users1.id),
  siteId: integer("siteId").references(() => sites1.id),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  publishedAt: timestamp("publishedAt", {
    mode: "date",
    withTimezone: true,
  }),
  visitDate: timestamp("visitDate", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
});

export const siteReportDetails1 = pgTable("siteReportDetails1", {
  id: serial("id")
    .primaryKey()
    .references(() => siteReports1.id),
  address: varchar("address"),

  // until something better is figured out with maybe temporary accounts ?
  ownerName: varchar("ownerName"),
  ownerPhone: varchar("ownerPhone"),
  ownerEmail: varchar("ownerEmail"),
  managerName: varchar("managerName"),
  managerPhone: varchar("managerPhone"),
  managerEmail: varchar("managerEmail"),
  contractorName: varchar("contractorName"),
  contractorPhone: varchar("contractorPhone"),
  contractorEmail: varchar("contractorEmail"),
  supervisorName: varchar("supervisorName"),
  supervisorPhone: varchar("supervisorPhone"),
  supervisorEmail: varchar("supervisorEmail"),

  // supervisorSignDate: timestamp("supervisorSignDate", {
  //   mode: "date",
  //   withTimezone: true,
  // }),
  // managerSignDate: timestamp("managerSignDate", {
  //   mode: "date",
  //   withTimezone: true,
  // }),
  // contractorSignDate: timestamp("contractorSignDate", {
  //   mode: "date",
  //   withTimezone: true,
  // }),

  activity: varchar("activity"),

  contractors: varchar("contractors"),
  engineers: varchar("engineers"),
  workers: varchar("workers"),
  visitors: varchar("visitors"),

  materialsUsed: varchar("materialsUsed"),
  equipmentUsed: varchar("equipmentUsed"),
  materialsInventory: varchar("materialsInventory"),
  equipmentInventory: varchar("equipmentInventory"),

  budget: varchar("budget"),
  spent: varchar("spent"),
  timeline: varchar("timeline"),
  completion: timestamp("completionDate", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const siteReportSections1 = pgTable("siteReportSections1", {
  id: serial("id").primaryKey(),
  reportId: integer("reportId").references(() => siteReports1.id),
  title: varchar("title"),
  content: varchar("content"),
  fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
});

export const feedback1 = pgTable("feedback1", {
  id: serial("id").primaryKey(),
  email: varchar("email"),
  message: varchar("message"),

  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});
