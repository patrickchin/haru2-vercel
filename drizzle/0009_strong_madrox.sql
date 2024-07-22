ALTER TABLE "projects1" DROP CONSTRAINT "projects1_commentSectionId_commentSections1_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks1" DROP CONSTRAINT "tasks1_commentSectionId_commentSections1_id_fk";
--> statement-breakpoint
ALTER TABLE "commentSections1" ADD COLUMN "projectId" integer;--> statement-breakpoint
ALTER TABLE "commentSections1" ADD COLUMN "taskId" integer;--> statement-breakpoint
ALTER TABLE "tasks1" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "tasks1" ADD COLUMN "cost" integer;--> statement-breakpoint
ALTER TABLE "tasks1" ADD COLUMN "costUnits" char(3);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentSections1" ADD CONSTRAINT "commentSections1_projectId_projects1_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commentSections1" ADD CONSTRAINT "commentSections1_taskId_tasks1_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "projects1" DROP COLUMN IF EXISTS "commentSectionId";--> statement-breakpoint
ALTER TABLE "tasks1" DROP COLUMN IF EXISTS "commentSectionId";