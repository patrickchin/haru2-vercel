DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('client', 'designer', 'manager', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "otps1" RENAME COLUMN "phoneNumber" TO "contactInfo";--> statement-breakpoint
ALTER TABLE "accounts1" ADD COLUMN "role" "role" DEFAULT 'client';