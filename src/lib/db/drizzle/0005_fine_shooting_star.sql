ALTER TABLE "siteReportDetails1" ADD COLUMN "supervisorSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "managerSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "contractorSignDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "publishedAt" timestamp with time zone;