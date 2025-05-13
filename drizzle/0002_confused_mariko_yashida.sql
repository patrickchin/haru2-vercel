ALTER TABLE "siteDetails1" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "siteDetails1" CASCADE;--> statement-breakpoint
DROP TABLE "siteReportDetails1" CASCADE;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "ownerId" text;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "supervisorId" text;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "architectId" text;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "managerId" text;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "contractorId" text;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "ownerSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "supervisorSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "architectSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "managerSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "contractorSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "numberOfWorkers" integer;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "workersHours" numeric;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "workersCost" numeric;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "workersCostCurrency" varchar;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "address" varchar;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "postcode" varchar;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "extraInfo" jsonb;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "commentsSectionId" integer;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "fileGroupId" integer;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "startDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "endDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "nextReportDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "schedule" varchar;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "budget" numeric;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "budgetUnits" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sites1" ADD CONSTRAINT "sites1_commentsSectionId_commentsSections1_id_fk" FOREIGN KEY ("commentsSectionId") REFERENCES "public"."commentsSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sites1" ADD CONSTRAINT "sites1_fileGroupId_fileGroups1_id_fk" FOREIGN KEY ("fileGroupId") REFERENCES "public"."fileGroups1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
