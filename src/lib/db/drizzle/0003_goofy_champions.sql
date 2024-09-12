CREATE TABLE IF NOT EXISTS "siteReportDetails1" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity" varchar,
	"contractors" varchar,
	"engineers" varchar,
	"workers" varchar,
	"visitors" varchar,
	"materials" varchar,
	"equiptment" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_id_siteReports1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."siteReports1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
