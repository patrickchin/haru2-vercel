ALTER TYPE "public"."siteMemberRole" ADD VALUE 'architect' BEFORE 'manager';--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "architectName" varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "architectPhone" varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "architectEmail" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "architectId" integer;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "architectSignDate" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_architectId_users1_id_fk" FOREIGN KEY ("architectId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
