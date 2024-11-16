CREATE TABLE IF NOT EXISTS "feedback1" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar,
	"message" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
