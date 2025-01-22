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
    id: serial("id").unique(),
    siteId: integer("siteId").references(() => sites1.id),
    memberId: integer("memberId").references(() => users1.id),
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
    email: varchar("email"),

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

export const siteReportDetails1 = pgTable("siteReportDetails1", {
  id: serial("id")
    .primaryKey()
    .references(() => siteReports1.id),

  ownerId: integer("ownerId").references(() => users1.id),
  supervisorId: integer("supervisorId").references(() => users1.id),
  architectId: integer("architectId").references(() => users1.id),
  managerId: integer("managerId").references(() => users1.id),
  contractorId: integer("contractorId").references(() => users1.id),

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

  activity: varchar("activity"),

  contractors: varchar("contractors"),
  engineers: varchar("engineers"),
  workers: varchar("workers"), // deprecated
  visitors: varchar("visitors"),

  numberOfWorkers: integer("numberOfWorkers"),
  workersHours: numeric("workersHours"),
  workersCost: numeric("workersCost"),
  workersCostCurrency: varchar("workersCostCurrency"),

  materialsUsed: varchar("materialsUsed"), // deprecated
  equipmentUsed: varchar("equipmentUsed"), // deprecated

  materialsInventory: varchar("materialsInventory"),
  equipmentInventory: varchar("equipmentInventory"),

  usedMaterialsListId: integer("usedMaterialsListId").references(
    () => materialsList1.id,
  ),
  // inventoryMaterialsListId: integer("inventoryMaterialsListId").references(() => materialsList1.id),
  usedEquipmentListId: integer("usedEquipmentListId").references(
    () => equipmentList1.id,
  ),
  // inventoryEquipmentListId: integer("inventoryEquipmentListId").references(() => equipmentList1.id),

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

export const commentsSections1 = pgTable("commentsSections1", {
  id: serial("id").primaryKey(),
});

export const comments1 = pgTable("comments1", {
  id: serial("id").primaryKey(),
  commentsSectionId: integer("commentsSectionId").references(
    () => commentsSections1.id,
  ),
  userId: integer("userId").references(() => users1.id),
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

  userId: integer("userId"),
  siteId: integer("siteId"),
  reportId: integer("reportId"),

  noticeId: integer("noticeId"),
  meetingId: integer("meetingId"),
  invitationId: integer("invitationId"),

  commentId: integer("commentId"),
  commentsSectionId: integer("commentsSectionId"),
  fileGroupId: integer("fileGroupId"),
  fileId: integer("fileId"),
});
