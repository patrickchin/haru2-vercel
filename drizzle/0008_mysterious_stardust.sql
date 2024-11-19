CREATE TABLE IF NOT EXISTS "commentsSections1" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments1" (
	"id" serial PRIMARY KEY NOT NULL,
	"commentsSectionId" integer,
	"userId" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"comment" varchar
);
--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "commentsSectionId" integer;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "commentsSectionId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments1" ADD CONSTRAINT "comments1_commentsSectionId_commentsSections1_id_fk" FOREIGN KEY ("commentsSectionId") REFERENCES "public"."commentsSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments1" ADD CONSTRAINT "comments1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_commentsSectionId_commentsSections1_id_fk" FOREIGN KEY ("commentsSectionId") REFERENCES "public"."commentsSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReports1" ADD CONSTRAINT "siteReports1_commentsSectionId_commentsSections1_id_fk" FOREIGN KEY ("commentsSectionId") REFERENCES "public"."commentsSections1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
