ALTER TABLE "siteReports1" ADD COLUMN "fileGroupId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReports1" ADD CONSTRAINT "siteReports1_fileGroupId_fileGroups1_id_fk" FOREIGN KEY ("fileGroupId") REFERENCES "public"."fileGroups1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
