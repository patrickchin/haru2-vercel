ALTER TABLE "siteMembers1" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "siteMembers1" ADD COLUMN "dateAdded" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "siteMembers1" ADD CONSTRAINT "siteMembers1_id_unique" UNIQUE("id");