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
  boolean,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// pnpm drizzle-kit push
// pnpm drizzle-kit introspect
// pnpm drizzle-kit generate
// pnpm drizzle-kit migrate

export const accountRoleEnum = pgEnum("accountRole", [
  "guest",
  "user",
  "admin",
]);

export const users1 = pgTable("user", {
  sid: serial("sid"),
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
  role: accountRoleEnum("role").default("user"),
});

export const accounts1 = pgTable(
  "account",
  {
    sid: serial("sid"),
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
  ],
);

export const sessions1 = pgTable("session", {
  sid: serial("sid"),
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users1.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens1 = pgTable(
  "verificationToken",
  {
    sid: serial("sid"),
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
  ],
);

export const authenticators1 = pgTable(
  "authenticator",
  {
    sid: serial("sid"),
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
  ],
);

export const files1 = pgTable("files1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
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
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  deletedAt: timestamp("deletedAt", { mode: "date", withTimezone: true }),
});

export const fileGroupFiles1 = pgTable(
  "fileGroupFiles1",
  {
    fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
    fileId: integer("fileId").references(() => files1.id),
  },
  (t) => [primaryKey({ columns: [t.fileGroupId, t.fileId] })],
);

// TODO could move to a separate file:
// ============================== Site Analysis ==============================

export const sites1 = pgTable("sites1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
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
  uuid: text("uuid")
    .notNull()
    .unique()
    .references(() => sites1.uuid),
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
    uuid: text("uuid")
      .notNull()
      .unique()
      .$defaultFn(() => crypto.randomUUID()),
    siteId: integer("siteId").references(() => sites1.id),
    email: text("email"),

    dateAdded: timestamp("dateAdded", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.siteId, t.email)],
);

export const siteReports1 = pgTable("siteReports1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
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

export const siteReportDetails1 = pgTable("siteReportDetails1", {
  id: serial("id")
    .primaryKey()
    .references(() => siteReports1.id),
  uuid: text("uuid")
    .notNull()
    .unique()
    .references(() => siteReports1.uuid),

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

  numberOfWorkers: integer("numberOfWorkers"),
  workersHours: numeric("workersHours"), // per day
  workersCost: numeric("workersCost"), // per day
  workersCostCurrency: varchar("workersCostCurrency"),
});


export const materials1 = pgTable("materials1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name"),
  quantity: integer("quantity"),
  quantityUnit: varchar("quantityUnit"),

  unitCost: numeric("unitCost"),
  unitCostCurrency: varchar("unitCostCurrency"),
  totalCost: numeric("totalCost"),
  totalCostCurrency: varchar("totalCostCurrency"),

  condition: varchar("condition"),
});

export const equipment1 = pgTable("equipments1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name"),
  quantity: integer("quantity"),
  cost: numeric("cost"),
  costUnits: varchar("costUnits"),

  condition: varchar("condition"),
  ownership: varchar("ownership"),
  operationTimeHours: numeric("operationTimeHours"),
});

export const siteActivity1 = pgTable("siteActivity1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
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
});

export const siteActivityMaterials1 = pgTable(
  "siteActivityMaterials1",
  {
    siteActivityId: integer("siteActivityId").references(
      () => siteActivity1.id,
      { onDelete: "cascade" },
    ),
    materialId: integer("materialId").references(() => materials1.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.siteActivityId, t.materialId] })],
);

export const siteActivityEquipment1 = pgTable(
  "siteActivityEquipment1",
  {
    siteActivityId: integer("siteActivityId").references(
      () => siteActivity1.id,
      { onDelete: "cascade" },
    ),
    equipmentId: integer("equipmentId").references(() => equipment1.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.siteActivityId, t.equipmentId] })],
);

export const siteReportActivity1 = pgTable(
  "siteReportActivity1",
  {
    siteReportId: integer("siteReportId").references(() => siteReports1.id),
    siteActivityId: integer("siteActivityId").references(
      () => siteActivity1.id,
    ),
  },
  (t) => [primaryKey({ columns: [t.siteReportId, t.siteActivityId] })],
);

export const siteReportSections1 = pgTable("siteReportSections1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  reportId: integer("reportId").references(() => siteReports1.id),
  title: varchar("title"),
  content: varchar("content"),
  fileGroupId: integer("fileGroupId").references(() => fileGroups1.id),
});

export const feedback1 = pgTable("feedback1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email"),
  message: varchar("message"),

  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const commentsSections1 = pgTable("commentsSections1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
});

export const comments1 = pgTable("comments1", {
  id: serial("id").primaryKey(),
  uuid: text("uuid")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
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

  invitationId: integer("invitationId"),

  commentId: integer("commentId"),
  commentsSectionId: integer("commentsSectionId"),
  fileGroupId: integer("fileGroupId"),
  fileId: integer("fileId"),
});
