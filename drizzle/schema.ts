import {
	pgTable,
	serial,
	varchar,
	integer,
	timestamp,
	unique,
	text,
	json,
	char
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

// pnpm drizzle-kit push:pg --driver=pg --schema="./drizzle/schema.ts" --connectionString="postgres://...?sslmode=require"
// pnpm drizzle-kit introspect:pg --driver=pg --connectionString="postgres://...?sslmode=require"

export const users1 = pgTable("users1", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
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
	countrycode: char("countrycode", { length: 2 }),
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
