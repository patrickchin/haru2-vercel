CREATE TABLE IF NOT EXISTS "siteActivity1" (
	"id" serial PRIMARY KEY NOT NULL,
	"siteActivityListId" integer,
	"name" varchar,
	"description" varchar,
	"contractors" varchar,
	"engineers" varchar,
	"visitors" varchar,
	"startDate" timestamp with time zone,
	"endOfDate" timestamp with time zone,
	"numberOfWorkers" integer,
	"workerHoursPerDay" numeric,
	"workerCostPerDay" numeric,
	"workersCostCurrency" varchar,
	"usedMaterialsListId" integer,
	"usedEquipmentListId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteActivityList1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "logs1" ADD COLUMN "activityId" integer;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "siteActivityListId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivity1" ADD CONSTRAINT "siteActivity1_siteActivityListId_siteActivityList1_id_fk" FOREIGN KEY ("siteActivityListId") REFERENCES "public"."siteActivityList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivity1" ADD CONSTRAINT "siteActivity1_usedMaterialsListId_materialsList1_id_fk" FOREIGN KEY ("usedMaterialsListId") REFERENCES "public"."materialsList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivity1" ADD CONSTRAINT "siteActivity1_usedEquipmentListId_equipmentList1_id_fk" FOREIGN KEY ("usedEquipmentListId") REFERENCES "public"."equipmentList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_siteActivityListId_siteActivityList1_id_fk" FOREIGN KEY ("siteActivityListId") REFERENCES "public"."siteActivityList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
