CREATE TABLE IF NOT EXISTS "materials1" (
	"id" serial PRIMARY KEY NOT NULL,
	"materialsListId" integer NOT NULL,
	"name" varchar NOT NULL,
	"quantity" integer,
	"quantityUnit" varchar,
	"cost" numeric,
	"costUnits" varchar,
	"condition" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materialsList1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "usedMaterialsListId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials1" ADD CONSTRAINT "materials1_materialsListId_materialsList1_id_fk" FOREIGN KEY ("materialsListId") REFERENCES "public"."materialsList1"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_usedMaterialsListId_materialsList1_id_fk" FOREIGN KEY ("usedMaterialsListId") REFERENCES "public"."materialsList1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
