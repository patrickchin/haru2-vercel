DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('client', 'manager', 'supervisor', 'admin');
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
CREATE TABLE IF NOT EXISTS "accounts1" (
	"id" serial PRIMARY KEY NOT NULL,
	"password" varchar,
	"email" varchar,
	"emailVerified" timestamp with time zone,
	"phone" varchar,
	"phoneVerified" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"role" "role" DEFAULT 'client',
	CONSTRAINT "accounts1_email_unique" UNIQUE("email"),
	CONSTRAINT "accounts1_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts1" (
	"id" serial PRIMARY KEY NOT NULL,
	"contactId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fileGroupFiles1" (
	"fileGroupId" integer,
	"fileId" integer,
	CONSTRAINT "fileGroupFiles1_fileGroupId_fileId_unique" UNIQUE("fileGroupId","fileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fileGroups1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uploaderId" integer,
	"filename" varchar,
	"filesize" integer,
	"url" varchar,
	"type" varchar,
	"uploadedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otps1" (
	"id" serial PRIMARY KEY NOT NULL,
	"contactInfo" varchar NOT NULL,
	"otp" varchar NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteDetails1" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar,
	"postcode" varchar,
	"description" varchar,
	"extraInfo" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"startDate" timestamp with time zone,
	"endDate" timestamp with time zone,
	"nextReportDate" timestamp with time zone,
	"schedule" varchar,
	"budget" numeric,
	"budgetUnits" varchar,
	"ownerName" varchar,
	"ownerPhone" varchar,
	"ownerEmail" varchar,
	"managerName" varchar,
	"managerPhone" varchar,
	"managerEmail" varchar,
	"contractorName" varchar,
	"contractorPhone" varchar,
	"contractorEmail" varchar,
	"supervisorName" varchar,
	"supervisorPhone" varchar,
	"supervisorEmail" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteMembers1" (
	"siteId" integer,
	"memberId" integer,
	"role" "siteMemberRole" DEFAULT 'member'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReportDetails1" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" varchar,
	"ownerName" varchar,
	"ownerPhone" varchar,
	"ownerEmail" varchar,
	"managerName" varchar,
	"managerPhone" varchar,
	"managerEmail" varchar,
	"contractorName" varchar,
	"contractorPhone" varchar,
	"contractorEmail" varchar,
	"supervisorName" varchar,
	"supervisorPhone" varchar,
	"supervisorEmail" varchar,
	"activity" varchar,
	"contractors" varchar,
	"engineers" varchar,
	"workers" varchar,
	"visitors" varchar,
	"materials" varchar,
	"equiptment" varchar,
	"budget" varchar,
	"spent" varchar,
	"timeline" varchar,
	"completionDate" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReportSections1" (
	"id" serial PRIMARY KEY NOT NULL,
	"reportId" integer,
	"title" varchar,
	"content" varchar,
	"fileGroupId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReports1" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporterId" integer,
	"siteId" integer,
	"createdAt" timestamp with time zone DEFAULT now(),
	"visitDate" timestamp with time zone DEFAULT now(),
	"fileGroupId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sites1" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"type" varchar,
	"countryCode" varchar,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users1" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"avatarUrl" varchar
);
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
 ALTER TABLE "files1" ADD CONSTRAINT "files1_uploaderId_users1_id_fk" FOREIGN KEY ("uploaderId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_id_siteReports1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."siteReports1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportSections1" ADD CONSTRAINT "siteReportSections1_reportId_siteReports1_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."siteReports1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportSections1" ADD CONSTRAINT "siteReportSections1_fileGroupId_fileGroups1_id_fk" FOREIGN KEY ("fileGroupId") REFERENCES "public"."fileGroups1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "siteReports1" ADD CONSTRAINT "siteReports1_fileGroupId_fileGroups1_id_fk" FOREIGN KEY ("fileGroupId") REFERENCES "public"."fileGroups1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users1" ADD CONSTRAINT "users1_id_accounts1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."accounts1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
