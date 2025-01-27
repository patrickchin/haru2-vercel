ALTER TABLE "siteReportDetails1" ADD COLUMN "inventoryMaterialsListId" integer;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "inventoryEquipmentListId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_inventoryMaterialsListId_materialsList1_id_fk" FOREIGN KEY ("inventoryMaterialsListId") REFERENCES "public"."materialsList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_inventoryEquipmentListId_equipmentList1_id_fk" FOREIGN KEY ("inventoryEquipmentListId") REFERENCES "public"."equipmentList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
