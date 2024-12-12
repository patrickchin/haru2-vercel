CREATE TABLE IF NOT EXISTS "siteInvitations1" (
	"id" serial NOT NULL,
	"siteId" integer,
	"email" varchar,
	"dateAdded" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "siteInvitations1_id_unique" UNIQUE("id"),
	CONSTRAINT "siteInvitations1_siteId_email_unique" UNIQUE("siteId","email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteInvitations1" ADD CONSTRAINT "siteInvitations1_siteId_sites1_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
