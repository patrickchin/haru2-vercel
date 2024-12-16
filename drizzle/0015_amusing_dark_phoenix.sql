CREATE TABLE IF NOT EXISTS "logs1" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"message" varchar,
	"userId" integer,
	"siteId" integer,
	"reportId" integer,
	"noticeId" integer,
	"meetingId" integer,
	"invitationId" integer,
	"commentId" integer,
	"commentsSectionId" integer,
	"fileGroupId" integer,
	"fileId" integer
);
