ALTER TABLE "files1" RENAME COLUMN "uploadedAt" TO "uploadedat";--> statement-breakpoint
ALTER TABLE "files1" ADD COLUMN "specId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_specId_tasks1_specId_fk" FOREIGN KEY ("specId") REFERENCES "public"."tasks1"("specId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
