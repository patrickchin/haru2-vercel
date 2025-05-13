CREATE TYPE "public"."accountRole" AS ENUM('guest', 'user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."siteMemberRole" AS ENUM('owner', 'architect', 'manager', 'contractor', 'supervisor', 'member');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"sid" serial NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"sid" serial NOT NULL,
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"commentsSectionId" integer,
	"userId" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"comment" varchar,
	CONSTRAINT "comments1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commentsSections1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	CONSTRAINT "commentsSections1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "equipments1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"name" varchar,
	"quantity" integer,
	"cost" numeric,
	"costUnits" varchar,
	"condition" varchar,
	"ownership" varchar,
	"operationTimeHours" numeric,
	CONSTRAINT "equipments1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "equipmentList1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"email" varchar,
	"message" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feedback1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fileGroupFiles1" (
	"fileGroupId" integer,
	"fileId" integer,
	CONSTRAINT "fileGroupFiles1_fileGroupId_fileId_pk" PRIMARY KEY("fileGroupId","fileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fileGroups1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "fileGroups1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"uploaderId" text,
	"filename" varchar,
	"filesize" integer,
	"url" varchar,
	"type" varchar,
	"uploadedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "files1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs1" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"message" varchar,
	"userId" text,
	"siteId" integer,
	"reportId" integer,
	"activityId" integer,
	"invitationId" integer,
	"commentId" integer,
	"commentsSectionId" integer,
	"fileGroupId" integer,
	"fileId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materials1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"name" varchar,
	"quantity" integer,
	"quantityUnit" varchar,
	"unitCost" numeric,
	"unitCostCurrency" varchar,
	"totalCost" numeric,
	"totalCostCurrency" varchar,
	"condition" varchar,
	CONSTRAINT "materials1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sid" serial NOT NULL,
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteActivity1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"siteActivityListId" integer,
	"name" varchar,
	"description" varchar,
	"contractors" varchar,
	"engineers" varchar,
	"visitors" varchar,
	"startDate" timestamp with time zone,
	"endOfDate" timestamp with time zone,
	"numberOfWorkers" integer,
	"workerHoursPerDay" numeric,
	"workerCostPerDay" numeric,
	"workersCostCurrency" varchar,
	CONSTRAINT "siteActivity1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteActivityEquipment1" (
	"siteActivityId" integer,
	"equipmentId" integer,
	CONSTRAINT "siteActivityEquipment1_siteActivityId_equipmentId_pk" PRIMARY KEY("siteActivityId","equipmentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteActivityList1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteActivityMaterials1" (
	"siteActivityId" integer,
	"materialId" integer,
	CONSTRAINT "siteActivityMaterials1_siteActivityId_materialId_pk" PRIMARY KEY("siteActivityId","materialId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteDetails1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"address" varchar,
	"postcode" varchar,
	"description" varchar,
	"extraInfo" jsonb,
	"commentsSectionId" integer,
	"fileGroupId" integer,
	"startDate" timestamp with time zone,
	"endDate" timestamp with time zone,
	"nextReportDate" timestamp with time zone,
	"schedule" varchar,
	"budget" numeric,
	"budgetUnits" varchar,
	CONSTRAINT "siteDetails1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteInvitations1" (
	"id" serial NOT NULL,
	"uuid" text NOT NULL,
	"siteId" integer,
	"email" text,
	"dateAdded" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "siteInvitations1_id_unique" UNIQUE("id"),
	CONSTRAINT "siteInvitations1_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "siteInvitations1_siteId_email_unique" UNIQUE("siteId","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteMembers1" (
	"id" serial NOT NULL,
	"uuid" text NOT NULL,
	"siteId" integer,
	"memberId" text,
	"role" "siteMemberRole" DEFAULT 'member',
	"dateAdded" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "siteMembers1_siteId_memberId_pk" PRIMARY KEY("siteId","memberId"),
	CONSTRAINT "siteMembers1_id_unique" UNIQUE("id"),
	CONSTRAINT "siteMembers1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReportDetails1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"ownerId" text,
	"supervisorId" text,
	"architectId" text,
	"managerId" text,
	"contractorId" text,
	"ownerSignDate" timestamp with time zone,
	"supervisorSignDate" timestamp with time zone,
	"architectSignDate" timestamp with time zone,
	"managerSignDate" timestamp with time zone,
	"contractorSignDate" timestamp with time zone,
	"siteActivityListId" integer,
	"numberOfWorkers" integer,
	"workersHours" numeric,
	"workersCost" numeric,
	"workersCostCurrency" varchar,
	CONSTRAINT "siteReportDetails1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReportSections1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"reportId" integer,
	"title" varchar,
	"content" varchar,
	"fileGroupId" integer,
	CONSTRAINT "siteReportSections1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReports1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"reporterId" text,
	"siteId" integer,
	"createdAt" timestamp with time zone DEFAULT now(),
	"deletedAt" timestamp with time zone,
	"publishedAt" timestamp with time zone,
	"visitDate" timestamp with time zone DEFAULT now(),
	"fileGroupId" integer,
	"commentsSectionId" integer,
	CONSTRAINT "siteReports1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sites1" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"title" varchar,
	"type" varchar,
	"countryCode" varchar,
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "sites1_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"sid" serial NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"role" "accountRole" DEFAULT 'user',
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"sid" serial NOT NULL,
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments1" ADD CONSTRAINT "comments1_commentsSectionId_commentsSections1_id_fk" FOREIGN KEY ("commentsSectionId") REFERENCES "public"."commentsSections1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivity1" ADD CONSTRAINT "siteActivity1_siteActivityListId_siteActivityList1_id_fk" FOREIGN KEY ("siteActivityListId") REFERENCES "public"."siteActivityList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityEquipment1" ADD CONSTRAINT "siteActivityEquipment1_siteActivityId_siteActivity1_id_fk" FOREIGN KEY ("siteActivityId") REFERENCES "public"."siteActivity1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityEquipment1" ADD CONSTRAINT "siteActivityEquipment1_equipmentId_equipments1_id_fk" FOREIGN KEY ("equipmentId") REFERENCES "public"."equipments1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityMaterials1" ADD CONSTRAINT "siteActivityMaterials1_siteActivityId_siteActivity1_id_fk" FOREIGN KEY ("siteActivityId") REFERENCES "public"."siteActivity1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityMaterials1" ADD CONSTRAINT "siteActivityMaterials1_materialId_materials1_id_fk" FOREIGN KEY ("materialId") REFERENCES "public"."materials1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_uuid_sites1_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "public"."sites1"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_commentsSectionId_commentsSections1_id_fk" FOREIGN KEY ("commentsSectionId") REFERENCES "public"."commentsSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_fileGroupId_fileGroups1_id_fk" FOREIGN KEY ("fileGroupId") REFERENCES "public"."fileGroups1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteInvitations1" ADD CONSTRAINT "siteInvitations1_siteId_sites1_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_id_siteReports1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."siteReports1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_uuid_siteReports1_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "public"."siteReports1"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_siteActivityListId_siteActivityList1_id_fk" FOREIGN KEY ("siteActivityListId") REFERENCES "public"."siteActivityList1"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "siteReports1" ADD CONSTRAINT "siteReports1_commentsSectionId_commentsSections1_id_fk" FOREIGN KEY ("commentsSectionId") REFERENCES "public"."commentsSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
