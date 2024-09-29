DO $$ BEGIN
 CREATE TYPE "public"."siteMeetingStatus" AS ENUM('pending', 'confirmed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteMeetings1" (
	"id" serial PRIMARY KEY NOT NULL,
	"siteId" integer,
	"status" "siteMeetingStatus" DEFAULT 'pending',
	"date" timestamp with time zone,
	"duration" interval,
	"notes" varchar,
	"url" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteMeetings1" ADD CONSTRAINT "siteMeetings1_siteId_sites1_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
