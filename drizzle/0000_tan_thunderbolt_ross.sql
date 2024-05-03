-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE IF NOT EXISTS "users1" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"name" varchar(255) NOT NULL,
	"phone" varchar(16),
	"phone1" varchar(32),
	"avatarUrl" varchar(255),
	"avatarColor" varchar(12),
	CONSTRAINT "users1_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects1" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"info" json NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"title" varchar(255),
	"description" text,
	"type" varchar(64),
	"subtype" varchar(64),
	"countryCode" char(2),
	"status" varchar(128) DEFAULT 'pending'::character varying
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uploaderId" integer,
	"projectId" integer,
	"url" varchar(255),
	"type" varchar(255),
	"filename" varchar(255) DEFAULT ''::character varying NOT NULL,
	"taskId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskspecs1" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"description" text,
	"type" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks1" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"title" varchar(255),
	"description" text,
	"type" varchar(255),
	"specid" integer,
	"lead" varchar(255),
	"status" varchar(255) DEFAULT 'pending'::character varying,
	"estimation" integer,
	"endDate" date,
	"startDate" date,
	"enabled" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskcomments1" (
	"id" serial PRIMARY KEY NOT NULL,
	"taskId" integer,
	"userId" integer,
	"createdAt" timestamp with time zone DEFAULT now(),
	"comment" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects1" ADD CONSTRAINT "projects1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_uploaderId_users1_id_fk" FOREIGN KEY ("uploaderId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_projectId_projects1_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_taskId_tasks1_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks1" ADD CONSTRAINT "tasks1_projectId_projects1_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks1" ADD CONSTRAINT "tasks1_specid_taskspecs1_id_fk" FOREIGN KEY ("specid") REFERENCES "public"."taskspecs1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskcomments1" ADD CONSTRAINT "taskcomments1_taskId_tasks1_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskcomments1" ADD CONSTRAINT "taskcomments1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
