CREATE TABLE IF NOT EXISTS "siteReportSections1" (
	"id" serial PRIMARY KEY NOT NULL,
	"reportId" integer,
	"title" varchar,
	"content" varchar,
	"fileGroupId" integer
);
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
