CREATE TABLE IF NOT EXISTS "teammembers1" (
	"teamId" integer,
	"userId" integer,
	CONSTRAINT "teammembers1_teamId_userId_unique" UNIQUE("teamId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams1" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer,
	"type" varchar(64),
	"leadId" integer
);
--> statement-breakpoint
ALTER TABLE "users1" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teammembers1" ADD CONSTRAINT "teammembers1_teamId_teams1_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teammembers1" ADD CONSTRAINT "teammembers1_userId_users1_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams1" ADD CONSTRAINT "teams1_projectId_projects1_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams1" ADD CONSTRAINT "teams1_leadId_users1_id_fk" FOREIGN KEY ("leadId") REFERENCES "public"."users1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
