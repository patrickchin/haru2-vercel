CREATE TABLE IF NOT EXISTS "siteMembers1" (
	"siteId" integer,
	"memberId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReportFiles1" (
	"reportId" integer,
	"filedId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReports1" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporterId" integer,
	"siteId" integer,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sites1" (
	"id" serial PRIMARY KEY NOT NULL
);
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
