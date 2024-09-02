-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('client', 'designer', 'manager', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."siteMemberRole" AS ENUM('owner', 'manager', 'contractor', 'supervisor', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users1" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"avatarUrl" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uploaderId" integer,
	"projectId" integer,
	"url" varchar(255),
	"type" varchar(255),
	"filename" varchar(255) DEFAULT ''::character varying NOT NULL,
	"taskId" integer,
	"commentId" integer,
	"filesize" integer,
	"uploadedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects1" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"info" json,
	"createdAt" timestamp with time zone DEFAULT now(),
	"title" varchar(255),
	"description" text,
	"type" varchar(64),
	"subtype" varchar(64),
	"countryCode" char(2),
	"status" varchar(128) DEFAULT 'pending'::character varying
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteMembers1" (
	"siteId" integer,
	"memberId" integer,
	"role" "siteMemberRole" DEFAULT 'member'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sites1" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(1024),
	"type" varchar(255),
	"countryCode" char(2),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts1" (
	"id" serial PRIMARY KEY NOT NULL,
	"contactId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteDetails1" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text,
	"postcode" varchar(255),
	"extraInfo" jsonb,
	"description" text,
	"managerName" varchar(256),
	"managerPhone" varchar(256),
	"managerEmail" varchar(256),
	"contractorName" varchar(256),
	"contractorPhone" varchar(256),
	"contractorEmail" varchar(256),
	"supervisorName" varchar(256),
	"supervisorPhone" varchar(256),
	"supervisorEmail" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"startDate" timestamp,
	"endDate" timestamp,
	"nextReportDate" timestamp,
	"schedule" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fileGroups1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fileGroupFiles1" (
	"fileGroupId" integer,
	"fileId" integer,
	CONSTRAINT "fileGroupFiles1_fileGroupId_fileId_unique" UNIQUE("fileGroupId","fileId")
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
	"specId" integer,
	"lead" varchar(255),
	"status" varchar(255) DEFAULT 'pending'::character varying,
	"estimation" integer,
	"endDate" date,
	"startDate" date,
	"enabled" boolean DEFAULT true,
	"duration" integer,
	"cost" integer,
	"costUnits" char(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments1" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"createdAt" timestamp with time zone DEFAULT now(),
	"comment" text,
	"sectionId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams1" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"type" varchar(64),
	"leadId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teammembers1" (
	"teamId" integer,
	"userId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otps1" (
	"id" serial PRIMARY KEY NOT NULL,
	"contactInfo" varchar(32) NOT NULL,
	"otp" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts1" (
	"id" serial PRIMARY KEY NOT NULL,
	"password" varchar(255),
	"email" varchar(255),
	"emailVerified" timestamp,
	"phone" varchar(32),
	"phoneVerified" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"role" "role" DEFAULT 'client',
	CONSTRAINT "accounts1_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commentSections1" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"taskId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReports1" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporterId" integer,
	"siteId" integer,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReportFiles1" (
	"reportId" integer,
	"filedId" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users1" ADD CONSTRAINT "users1_id_accounts1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."accounts1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "files1" ADD CONSTRAINT "files1_uploaderId_users1_id_fk" FOREIGN KEY ("uploaderId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_commentId_comments1_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects1" ADD CONSTRAINT "projects1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteMembers1" ADD CONSTRAINT "siteMembers1_siteId_sites1_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteMembers1" ADD CONSTRAINT "siteMembers1_memberId_users1_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts1" ADD CONSTRAINT "contacts1_id_users1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts1" ADD CONSTRAINT "contacts1_contactId_users1_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_id_sites1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fileGroupFiles1" ADD CONSTRAINT "fileGroupFiles1_fileGroupId_fileGroups1_id_fk" FOREIGN KEY ("fileGroupId") REFERENCES "public"."fileGroups1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fileGroupFiles1" ADD CONSTRAINT "fileGroupFiles1_fileId_files1_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "tasks1" ADD CONSTRAINT "tasks1_specId_taskSpecs1_id_fk" FOREIGN KEY ("specId") REFERENCES "public"."taskspecs1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments1" ADD CONSTRAINT "comments1_sectionId_commentSections1_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."commentSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments1" ADD CONSTRAINT "comments1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams1" ADD CONSTRAINT "teams1_projectId_projects1_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams1" ADD CONSTRAINT "teams1_leadId_users1_id_fk" FOREIGN KEY ("leadId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teammembers1" ADD CONSTRAINT "teammembers1_teamId_teams1_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teammembers1" ADD CONSTRAINT "teammembers1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentSections1" ADD CONSTRAINT "commentSections1_projectId_projects1_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentSections1" ADD CONSTRAINT "commentSections1_taskId_tasks1_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReports1" ADD CONSTRAINT "siteReports1_reporterId_users1_id_fk" FOREIGN KEY ("reporterId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReports1" ADD CONSTRAINT "siteReports1_siteId_sites1_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportFiles1" ADD CONSTRAINT "siteReportFiles1_reportId_siteReports1_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."siteReports1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportFiles1" ADD CONSTRAINT "siteReportFiles1_filedId_files1_id_fk" FOREIGN KEY ("filedId") REFERENCES "public"."files1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;