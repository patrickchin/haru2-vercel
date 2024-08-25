CREATE TABLE IF NOT EXISTS "commentSections1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "taskcomments1" RENAME TO "comments1";--> statement-breakpoint
ALTER TABLE "files1" DROP CONSTRAINT "files1_commentId_taskcomments1_id_fk";
--> statement-breakpoint
ALTER TABLE "comments1" DROP CONSTRAINT "taskcomments1_taskId_tasks1_id_fk";
--> statement-breakpoint
ALTER TABLE "comments1" DROP CONSTRAINT "taskcomments1_userId_users1_id_fk";
--> statement-breakpoint
ALTER TABLE "projects1" ADD COLUMN "commentSectionId" integer;--> statement-breakpoint
ALTER TABLE "comments1" ADD COLUMN "sectionId" integer;--> statement-breakpoint
ALTER TABLE "tasks1" ADD COLUMN "commentSectionId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_commentId_comments1_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects1" ADD CONSTRAINT "projects1_commentSectionId_commentSections1_id_fk" FOREIGN KEY ("commentSectionId") REFERENCES "public"."commentSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments1" ADD CONSTRAINT "comments1_sectionId_commentSections1_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."commentSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments1" ADD CONSTRAINT "comments1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks1" ADD CONSTRAINT "tasks1_commentSectionId_commentSections1_id_fk" FOREIGN KEY ("commentSectionId") REFERENCES "public"."commentSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "comments1" DROP COLUMN IF EXISTS "taskId";