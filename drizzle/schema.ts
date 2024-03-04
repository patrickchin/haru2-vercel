import { pgTable, serial, varchar, integer, timestamp, unique, text, bigint, foreignKey, json, primaryKey } from "drizzle-orm/pg-core"

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
	info: json("info").notNull().notNull(),
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





// unused
export const users2 = pgTable("users2", {
	id: serial("id").primaryKey().notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }),
	username: varchar("username", { length: 255 }),
});

// unused
export const sessions = pgTable("sessions", {
	id: serial("id").primaryKey().notNull(),
	userId: integer("userId").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
	sessionToken: varchar("sessionToken", { length: 255 }).notNull(),
});

// unused
export const accounts = pgTable("accounts", {
	id: serial("id").primaryKey().notNull(),
	userId: integer("userId").notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	provider: varchar("provider", { length: 255 }).notNull(),
	providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiresAt: bigint("expires_at", { mode: "number" }),
	idToken: text("id_token"),
	scope: text("scope"),
	sessionState: text("session_state"),
	tokenType: text("token_type"),
});

// unused
export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	email: varchar("email", { length: 255 }),
	emailVerified: timestamp("emailVerified", { withTimezone: true, mode: 'string' }),
	image: text("image"),
});

// unused
export const verificationToken = pgTable("verification_token", {
	identifier: text("identifier").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
	token: text("token").notNull(),
},
(table) => {
	return {
		verificationTokenPkey: primaryKey({ columns: [table.identifier, table.token], name: "verification_token_pkey"})
	}
});