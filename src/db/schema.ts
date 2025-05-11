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
  text,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters"

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

export const users1 = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  role: accountRoleEnum("role").default("client"),
});
 
export const accounts1 = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users1.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions1 = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users1.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens1 = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators1 = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users1.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)


export const files1 = pgTable("files1", {
  id: serial("id").primaryKey(),
  uploaderId: text("uploaderId"), // .references(() => users.id),

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
  deletedAt: timestamp("deletedAt", { mode: "date", withTimezone: true }),
});

export const fileGroupFiles1 = pgTable(
  "fileGroupFiles1",
  {
    fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
    fileId: integer("fileId").references(() => files1.id),
  },
  (t) => [unique().on(t.fileGroupId, t.fileId)],
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

  commentsSectionId: integer("commentsSectionId").references(
    () => commentsSections1.id,
  ),
  fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),

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
  architectName: varchar("architectName"),
  architectPhone: varchar("architectPhone"),
  architectEmail: varchar("architectEmail"),
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
  "architect",
  "manager",
  "contractor",
  "supervisor",
  "member",
]);

export const siteMembers1 = pgTable(
  "siteMembers1",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    siteId: integer("siteId").references(() => sites1.id),
    memberId: text("memberId"), // .references(() => users1.id),
    role: siteMemberRole("role").default("member"),

    dateAdded: timestamp("dateAdded", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.siteId, t.memberId] })],
);

export const siteInvitations1 = pgTable(
  "siteInvitations1",
  {
    id: serial("id").unique(),
    siteId: integer("siteId").references(() => sites1.id),
    email: text("email"),

    dateAdded: timestamp("dateAdded", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.siteId, t.email)],
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
  userId: text("userId"), // .references(() => users1.id),
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
  reporterId: text("reporterId"), // .references(() => users1.id),
  siteId: integer("siteId").references(() => sites1.id),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  deletedAt: timestamp("deletedAt", {
    mode: "date",
    withTimezone: true,
  }),
  publishedAt: timestamp("publishedAt", {
    mode: "date",
    withTimezone: true,
  }),
  visitDate: timestamp("visitDate", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
  commentsSectionId: integer("commentsSectionId").references(
    () => commentsSections1.id,
  ),
});

export const materialsList1 = pgTable("materialsList1", {
  id: serial("id").primaryKey(),
});

export const materials1 = pgTable("materials1", {
  id: serial("id").primaryKey(),
  materialsListId: integer("materialsListId")
    .references(() => materialsList1.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name"),
  quantity: integer("quantity"),
  quantityUnit: varchar("quantityUnit"),

  unitCost: numeric("unitCost"),
  unitCostCurrency: varchar("unitCostCurrency"),
  totalCost: numeric("totalCost"),
  totalCostCurrency: varchar("totalCostCurrency"),

  cost: numeric("cost"), // deprecated
  costUnits: varchar("costUnits"), // deprecated

  condition: varchar("condition"),
});

export const equipmentList1 = pgTable("equipmentList1", {
  id: serial("id").primaryKey(),
});

export const equipment1 = pgTable("equipments1", {
  id: serial("id").primaryKey(),
  equipmentListId: integer("equipmentListId").references(
    () => equipmentList1.id,
    { onDelete: "cascade" },
  ).notNull(),
  name: varchar("name"),
  quantity: integer("quantity"),
  cost: numeric("cost"),
  costUnits: varchar("costUnits"),

  condition: varchar("condition"),
  ownership: varchar("ownership"),
  operationTimeHours: numeric("operationTimeHours"),
});

export const siteActivityList1 = pgTable("siteActivityList1", {
  id: serial("id").primaryKey(),
});

export const siteActivity1 = pgTable("siteActivity1", {
  id: serial("id").primaryKey(),
  siteActivityListId: integer("siteActivityListId").references(
    () => siteActivityList1.id,
  ),
  name: varchar("name"),
  description: varchar("description"),

  contractors: varchar("contractors"),
  engineers: varchar("engineers"),
  visitors: varchar("visitors"),

  startDate: timestamp("startDate", { mode: "date", withTimezone: true }),
  endOfDate: timestamp("endOfDate", { mode: "date", withTimezone: true }),

  numberOfWorkers: integer("numberOfWorkers"),
  workersHoursPerDay: numeric("workerHoursPerDay"),
  workersCostPerDay: numeric("workerCostPerDay"),
  workersCostCurrency: varchar("workersCostCurrency"),

  usedMaterialsListId: integer("usedMaterialsListId").references(
    () => materialsList1.id,
  ),
  usedEquipmentListId: integer("usedEquipmentListId").references(
    () => equipmentList1.id,
  ),
});

export const siteReportDetails1 = pgTable("siteReportDetails1", {
  id: serial("id")
    .primaryKey()
    .references(() => siteReports1.id),

  ownerId: text("ownerId"), // .references(() => users1.id),
  supervisorId: text("supervisorId"), // .references(() => users1.id),
  architectId: text("architectId"), // .references(() => users1.id),
  managerId: text("managerId"), // .references(() => users1.id),
  contractorId: text("contractorId"), // .references(() => users1.id),

  ownerSignDate: timestamp("ownerSignDate", {
    mode: "date",
    withTimezone: true,
  }),
  supervisorSignDate: timestamp("supervisorSignDate", {
    mode: "date",
    withTimezone: true,
  }),
  architectSignDate: timestamp("architectSignDate", {
    mode: "date",
    withTimezone: true,
  }),
  managerSignDate: timestamp("managerSignDate", {
    mode: "date",
    withTimezone: true,
  }),
  contractorSignDate: timestamp("contractorSignDate", {
    mode: "date",
    withTimezone: true,
  }),

  inventoryMaterialsListId: integer("inventoryMaterialsListId").references(
    () => materialsList1.id,
  ),
  inventoryEquipmentListId: integer("inventoryEquipmentListId").references(
    () => equipmentList1.id,
  ),

  siteActivityListId: integer("siteActivityListId").references(
    () => siteActivityList1.id,
  ),

  contractors: varchar("contractors"), // deprecated
  engineers: varchar("engineers"), // deprecated
  visitors: varchar("visitors"), // deprecated

  activity: varchar("activity"), // deprecated
  workers: varchar("workers"), // deprecated
  numberOfWorkers: integer("numberOfWorkers"),
  workersHours: numeric("workersHours"), // per day
  workersCost: numeric("workersCost"), // per day
  workersCostCurrency: varchar("workersCostCurrency"),
  materialsUsed: varchar("materialsUsed"), // deprecated
  equipmentUsed: varchar("equipmentUsed"), // deprecated
  materialsInventory: varchar("materialsInventory"), // deprecated
  equipmentInventory: varchar("equipmentInventory"), // deprecated
  usedMaterialsListId: integer("usedMaterialsListId").references(
    () => materialsList1.id,
  ), // deprecated
  usedEquipmentListId: integer("usedEquipmentListId").references(
    () => equipmentList1.id,
  ), // deprecated

  budget: varchar("budget"), // unused for now
  spent: varchar("spent"), // unused for now
  timeline: varchar("timeline"), // unused for now
  completion: timestamp("completionDate", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(), // unused for now
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

export const commentsSections1 = pgTable("commentsSections1", {
  id: serial("id").primaryKey(),
});

export const comments1 = pgTable("comments1", {
  id: serial("id").primaryKey(),
  commentsSectionId: integer("commentsSectionId").references(
    () => commentsSections1.id,
  ),
  userId: text("userId"), // .references(() => users1.id),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  comment: varchar("comment"),
});

export const logs1 = pgTable("logs1", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  message: varchar("message"),

  userId: text("userId"),
  siteId: integer("siteId"),
  reportId: integer("reportId"),
  activityId: integer("activityId"),

  noticeId: integer("noticeId"),
  meetingId: integer("meetingId"),
  invitationId: integer("invitationId"),

  commentId: integer("commentId"),
  commentsSectionId: integer("commentsSectionId"),
  fileGroupId: integer("fileGroupId"),
  fileId: integer("fileId"),
});
