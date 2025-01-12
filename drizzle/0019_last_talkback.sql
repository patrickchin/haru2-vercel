CREATE TABLE IF NOT EXISTS "equipments1" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipmentListId" integer NOT NULL,
	"name" varchar,
	"quantity" integer,
	"cost" numeric,
	"costUnits" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "equipmentList1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "usedEquipmentListId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "equipments1" ADD CONSTRAINT "equipments1_equipmentListId_equipmentList1_id_fk" FOREIGN KEY ("equipmentListId") REFERENCES "public"."equipmentList1"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_usedEquipmentListId_equipmentList1_id_fk" FOREIGN KEY ("usedEquipmentListId") REFERENCES "public"."equipmentList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
