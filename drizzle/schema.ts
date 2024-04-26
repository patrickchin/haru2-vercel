import {
	pgTable,
	serial,
	varchar,
	integer,
	timestamp,
	unique,
	text,
	json,
	char,
	date,
	boolean
} from "drizzle-orm/pg-core";

// pnpm drizzle-kit push:pg
// pnpm drizzle-kit introspect:pg

export const users1 = pgTable("users1", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	old1phone: varchar("phone", { length: 16 }), // deprecated
	phone: varchar("phone1", { length: 32 }),
	// caps?
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

// is this really necessary?
export const taskspecs1 = pgTable("taskspecs1", {
	id: serial("id").primaryKey().notNull(),
	type: varchar("type", { length: 255 }),
	title: varchar("title", { length: 255 }),
	description: text("description"),
	// default duration
});

export const tasks1 = pgTable("tasks1", {
	id: serial("id").primaryKey().notNull(),
	specid: integer("specid").references(() => taskspecs1.id),
	projectid: integer("projectid").references(() => projects1.id),
	lead: varchar("lead", { length: 255 }),
	// owner: integer("ownerid").references(() => users1.id),
	// members: integer("ownerid").references(() => users1.id),
	type: varchar("type", { length: 255 }),
	status: varchar("status", { length: 255 }).default("pending"),
	startdate: date('startdate', { mode: "date" }),
	enddate: date('enddate', { mode: "date" }),
	estimation: integer("estimation"), // in days
	title: varchar("title", { length: 255 }),
	description: text("description"),
	enabled: boolean("enabled").default(true),
	// updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// export const taskupdate1 = pgTable("taskupdate1", {
// })

export const taskcomments1 = pgTable("taskcomments1", {
	id: serial("id").primaryKey().notNull(),
	taskid: integer("taskid").references(() => tasks1.id),
	userid: integer("userid").references(() => users1.id),
	createdat: timestamp("createdat", { withTimezone: true, mode: 'string' }).defaultNow(),
	comment: text("comment"),
});

export const files1 = pgTable("files1", {
	id: serial("id").primaryKey().notNull(),
	uploaderid: integer("uploaderid").references(() => users1.id),
	projectid: integer("projectid").references(() => projects1.id),
	taskid: integer("taskid").references(() => tasks1.id),
	filename: varchar("filename", { length: 255 }).notNull().default(""),
	url: varchar("url", { length: 255 }),
	type: varchar("type", { length: 255 }),
});