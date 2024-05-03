ALTER TABLE "tasks1" RENAME COLUMN "specid" TO "specId";--> statement-breakpoint
ALTER TABLE "projects1" DROP CONSTRAINT "projects1_userId_users1_id_fk";
--> statement-breakpoint
ALTER TABLE "files1" DROP CONSTRAINT "files1_uploaderId_users1_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks1" DROP CONSTRAINT "tasks1_specid_taskspecs1_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks1" DROP CONSTRAINT "tasks1_projectId_projects1_id_fk";
--> statement-breakpoint
ALTER TABLE "taskcomments1" DROP CONSTRAINT "taskcomments1_taskId_tasks1_id_fk";
--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "filename" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects1" ADD CONSTRAINT "projects1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files1" ADD CONSTRAINT "files1_uploaderId_users1_id_fk" FOREIGN KEY ("uploaderId") REFERENCES "users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks1" ADD CONSTRAINT "tasks1_specId_taskspecs1_id_fk" FOREIGN KEY ("specId") REFERENCES "taskspecs1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks1" ADD CONSTRAINT "tasks1_projectId_projects1_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskcomments1" ADD CONSTRAINT "taskcomments1_taskId_tasks1_id_fk" FOREIGN KEY ("taskId") REFERENCES "tasks1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
