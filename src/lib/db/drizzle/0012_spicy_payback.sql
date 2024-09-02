ALTER TABLE "accounts1" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "managerName" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "managerPhone" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "managerEmail" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "contractorName" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "contractorPhone" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "contractorEmail" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "supervisorName" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "supervisorPhone" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "supervisorEmail" varchar(256);--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "startDate" timestamp;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "endDate" timestamp;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "nextReportDate" timestamp;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "schedule" text;