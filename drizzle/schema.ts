import {
	pgTable,
	serial,
	varchar,
	integer,
	timestamp,
	unique,
	text,
	json,
	primaryKey
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

// pnpm drizzle-kit push:pg --driver=pg --schema="./drizzle/schema.ts" --connectionString="postgres://...?sslmode=require"
// pnpm drizzle-kit introspect:pg --driver=pg --connectionString="postgres://...?sslmode=require"

export const users1 = pgTable("users1", {
	id: serial("id").primaryKey().notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		usersEmailKey: unique("users_email_key").on(table.email),
	}
});

export const projects1 = pgTable("projects1", {
	id: serial("id").primaryKey().notNull(),
	userid: integer("userid").references(() => users1.id),
	title: varchar("title", { length: 255 }),
	description: text("description"),
	type: varchar("type", { length: 64 }),
	subtype: varchar("subtype", { length: 64 }),
	countrycode: varchar("countrycode", { length: 64 }),
	status: varchar("status", { length: 128 }).default("pending"),
	extrainfo: json("info").notNull(),
	createdat: timestamp("createdat", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const files1 = pgTable("files1", {
	id: serial("id").primaryKey().notNull(),
	uploaderid: integer("uploaderid").references(() => users1.id),
	projectid: integer("projectid").references(() => projects1.id),
	filename: varchar("filename", { length: 255 }).notNull().default(""),
	url: varchar("url", { length: 255 }).notNull().default(""),
	type: varchar("type", { length: 255 }).notNull().default(""),
});



export const users = pgTable("user", {
 id: text("id").notNull().primaryKey(),
 name: text("name"),
 email: text("email").notNull(),
 emailVerified: timestamp("emailVerified", { mode: "date" }),
 image: text("image"),
})

export const accounts = pgTable(
"account",
{
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
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
(account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
})
)

export const sessions = pgTable("session", {
 sessionToken: text("sessionToken").notNull().primaryKey(),
 userId: text("userId")
   .notNull()
   .references(() => users.id, { onDelete: "cascade" }),
 expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
 "verificationToken",
 {
   identifier: text("identifier").notNull(),
   token: text("token").notNull(),
   expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 })
)