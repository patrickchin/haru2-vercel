ALTER TABLE "taskspecs1" RENAME TO "taskSpecs1";--> statement-breakpoint
ALTER TABLE "teammembers1" RENAME TO "teamMembers1";--> statement-breakpoint
ALTER TABLE "tasks1" DROP CONSTRAINT "tasks1_specId_taskSpecs1_id_fk";
--> statement-breakpoint
ALTER TABLE "teamMembers1" DROP CONSTRAINT "teammembers1_teamId_teams1_id_fk";
--> statement-breakpoint
ALTER TABLE "teamMembers1" DROP CONSTRAINT "teammembers1_userId_users1_id_fk";
--> statement-breakpoint
ALTER TABLE "users1" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users1" ALTER COLUMN "avatarUrl" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "url" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "filename" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "filename" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "filename" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "files1" ALTER COLUMN "uploadedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "title" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "description" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "subtype" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "countryCode" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "status" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projects1" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "sites1" ALTER COLUMN "title" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "sites1" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "sites1" ALTER COLUMN "countryCode" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "sites1" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "postcode" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "description" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "managerName" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "managerPhone" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "managerEmail" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "contractorName" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "contractorPhone" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "contractorEmail" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "supervisorName" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "supervisorPhone" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "supervisorEmail" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "startDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "endDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "nextReportDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteDetails1" ALTER COLUMN "schedule" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "taskSpecs1" ALTER COLUMN "title" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "taskSpecs1" ALTER COLUMN "description" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "taskSpecs1" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "title" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "description" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "lead" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "status" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "tasks1" ALTER COLUMN "costUnits" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "comments1" ALTER COLUMN "comment" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "teams1" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "otps1" ALTER COLUMN "contactInfo" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "otps1" ALTER COLUMN "otp" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "otps1" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "otps1" ALTER COLUMN "createdAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "otps1" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts1" ALTER COLUMN "password" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "accounts1" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "accounts1" ALTER COLUMN "emailVerified" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts1" ALTER COLUMN "phone" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "accounts1" ALTER COLUMN "phoneVerified" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts1" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReports1" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "budget" numeric;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "budgetUnits" varchar;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "visitDate" timestamp with time zone DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks1" ADD CONSTRAINT "tasks1_specId_taskSpecs1_id_fk" FOREIGN KEY ("specId") REFERENCES "public"."taskSpecs1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamMembers1" ADD CONSTRAINT "teamMembers1_teamId_teams1_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamMembers1" ADD CONSTRAINT "teamMembers1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "teamMembers1" ADD CONSTRAINT "teamMembers1_teamId_userId_unique" UNIQUE("teamId","userId");--> statement-breakpoint
ALTER TABLE "accounts1" ADD CONSTRAINT "accounts1_phone_unique" UNIQUE("phone");