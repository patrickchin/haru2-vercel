ALTER TABLE "siteReportDetails1" RENAME COLUMN "materials" TO "materialsUsed";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" RENAME COLUMN "equiptment" TO "equipmentUsed";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "materialsInventory" varchar;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "equipmentInventory" varchar;