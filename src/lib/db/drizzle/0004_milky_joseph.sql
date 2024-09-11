ALTER TABLE "siteDetails1" ADD COLUMN "ownerName" varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "ownerPhone" varchar;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "ownerEmail" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "address" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "arrivalTime" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "departTime" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "ownerName" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "ownerPhone" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "ownerEmail" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "managerName" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "managerPhone" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "managerEmail" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "contractorName" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "contractorPhone" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "contractorEmail" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "supervisorName" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "supervisorPhone" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "supervisorEmail" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "budget" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "spent" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "timeline" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "completion" varchar;