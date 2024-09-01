ALTER TABLE "siteDetails1" RENAME COLUMN "descriptionJson" TO "extraInfo";--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "description" text;