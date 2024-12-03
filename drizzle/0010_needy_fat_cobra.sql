ALTER TABLE "siteReportDetails1" ADD COLUMN "supervisorId" integer;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "managerId" integer;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "contractorId" integer;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "supervisorSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "managerSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "contractorSignDate" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_supervisorId_users1_id_fk" FOREIGN KEY ("supervisorId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_managerId_users1_id_fk" FOREIGN KEY ("managerId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_contractorId_users1_id_fk" FOREIGN KEY ("contractorId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "address";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "ownerName";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "ownerPhone";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "ownerEmail";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "managerName";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "managerPhone";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "managerEmail";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "contractorName";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "contractorPhone";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "contractorEmail";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "supervisorName";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "supervisorPhone";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "supervisorEmail";