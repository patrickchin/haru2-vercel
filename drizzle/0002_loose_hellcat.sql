CREATE TABLE IF NOT EXISTS "siteNotices1" (
	"id" serial PRIMARY KEY NOT NULL,
	"siteId" integer,
	"resolved" boolean,
	"description" varchar,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteNotices1" ADD CONSTRAINT "siteNotices1_siteId_sites1_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
