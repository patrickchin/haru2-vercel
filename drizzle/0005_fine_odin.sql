ALTER TABLE "siteReports1" ADD COLUMN "publishedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "createdAt";