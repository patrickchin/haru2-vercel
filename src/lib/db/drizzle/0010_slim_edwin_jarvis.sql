DO $$ BEGIN
 CREATE TYPE "public"."siteMemberRole" AS ENUM('owner', 'manager', 'contractor', 'supervisor', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts1" (
	"id" serial PRIMARY KEY NOT NULL,
	"contactId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteDetails1" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text,
	"postcode" varchar(255),
	"descriptionJson" jsonb
);
--> statement-breakpoint
ALTER TABLE "siteMembers1" ADD COLUMN "role" "siteMemberRole" DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "title" varchar(1024);--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "type" varchar(255);--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "countryCode" char(2);--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts1" ADD CONSTRAINT "contacts1_id_users1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts1" ADD CONSTRAINT "contacts1_contactId_users1_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_id_sites1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sites1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
