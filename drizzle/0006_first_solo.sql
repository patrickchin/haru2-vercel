CREATE TABLE IF NOT EXISTS "otps1" (
	"id" serial PRIMARY KEY NOT NULL,
	"phoneNumber" varchar(32) NOT NULL,
	"otp" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL
);
