ALTER TABLE "files1" RENAME COLUMN "commentid" TO "commentId";--> statement-breakpoint
ALTER TABLE "files1" DROP CONSTRAINT "files1_commentid_taskcomments1_id_fk";
--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "filesize" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "filesize" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "files1" ADD COLUMN "uploadedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_commentId_taskcomments1_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."taskcomments1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
