CREATE TABLE IF NOT EXISTS "accounts1" (
	"id" serial PRIMARY KEY NOT NULL,
	"password" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"phone" varchar(32),
	"phoneVerified" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts1_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 INSERT INTO "accounts1" SELECT "id", "password", "email", NULL, "phone", NULL, "createdAt" FROM "users1";
END $$;
-- --> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users1" ADD CONSTRAINT "users1_id_accounts1_id_fk" FOREIGN KEY ("id") REFERENCES "public"."accounts1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users1" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "users1" DROP COLUMN IF EXISTS "password";--> statement-breakpoint
ALTER TABLE "users1" DROP COLUMN IF EXISTS "phone";--> statement-breakpoint
ALTER TABLE "users1" DROP COLUMN IF EXISTS "phone1";--> statement-breakpoint
ALTER TABLE "users1" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "users1" DROP COLUMN IF EXISTS "avatarColor";