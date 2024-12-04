ALTER TABLE "siteReportDetails1" ADD COLUMN "ownerId" integer;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "ownerSignDate" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_ownerId_users1_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
