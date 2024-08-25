ALTER TABLE "files1" ADD COLUMN "commentid" integer;--> statement-breakpoint
ALTER TABLE "files1" ADD COLUMN "filesize" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_commentid_taskcomments1_id_fk" FOREIGN KEY ("commentid") REFERENCES "taskcomments1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
