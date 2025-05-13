CREATE TYPE "public"."accountRole" AS ENUM('guest', 'user', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteActivityEquipment1" (
	"siteActivityId" integer,
	"equipmentId" integer,
	CONSTRAINT "siteActivityEquipment1_siteActivityId_equipmentId_pk" PRIMARY KEY("siteActivityId","equipmentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteActivityMaterials1" (
	"siteActivityId" integer,
	"materialId" integer,
	CONSTRAINT "siteActivityMaterials1_siteActivityId_materialId_pk" PRIMARY KEY("siteActivityId","materialId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteReportActivity1" (
	"siteReportId" integer,
	"siteActivityId" integer,
	CONSTRAINT "siteReportActivity1_siteReportId_siteActivityId_pk" PRIMARY KEY("siteReportId","siteActivityId")
);
--> statement-breakpoint
ALTER TABLE "equipmentList1" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "materialsList1" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "siteMeetings1" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "siteNotices1" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "siteActivityList1" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "equipmentList1" CASCADE;--> statement-breakpoint
DROP TABLE "materialsList1" CASCADE;--> statement-breakpoint
DROP TABLE "siteMeetings1" CASCADE;--> statement-breakpoint
DROP TABLE "siteNotices1" CASCADE;--> statement-breakpoint
DROP TABLE "siteActivityList1" CASCADE;--> statement-breakpoint
ALTER TABLE "fileGroupFiles1" DROP CONSTRAINT "fileGroupFiles1_fileGroupId_fileId_unique";--> statement-breakpoint
ALTER TABLE "equipments1" DROP CONSTRAINT "equipments1_equipmentListId_equipmentList1_id_fk";
--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP CONSTRAINT "siteReportDetails1_siteActivityListId_siteActivityList1_id_fk";
--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP CONSTRAINT "siteReportDetails1_usedMaterialsListId_materialsList1_id_fk";
--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP CONSTRAINT "siteReportDetails1_usedEquipmentListId_equipmentList1_id_fk";
--> statement-breakpoint
ALTER TABLE "materials1" DROP CONSTRAINT "materials1_materialsListId_materialsList1_id_fk";
--> statement-breakpoint
ALTER TABLE "siteActivity1" DROP CONSTRAINT "siteActivity1_siteActivityListId_siteActivityList1_id_fk";
--> statement-breakpoint
ALTER TABLE "siteActivity1" DROP CONSTRAINT "siteActivity1_usedMaterialsListId_materialsList1_id_fk";
--> statement-breakpoint
ALTER TABLE "siteActivity1" DROP CONSTRAINT "siteActivity1_usedEquipmentListId_equipmentList1_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE accountRole;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "siteMembers1" ALTER COLUMN "siteId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "siteMembers1" ALTER COLUMN "memberId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "fileGroupFiles1" ADD CONSTRAINT "fileGroupFiles1_fileGroupId_fileId_pk" PRIMARY KEY("fileGroupId","fileId");--> statement-breakpoint
ALTER TABLE "commentsSections1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "fileGroups1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "feedback1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "equipments1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "files1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "siteInvitations1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "siteReportSections1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "siteReports1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comments1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "materials1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "siteActivity1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sites1" ADD COLUMN "uuid" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityEquipment1" ADD CONSTRAINT "siteActivityEquipment1_siteActivityId_siteActivity1_id_fk" FOREIGN KEY ("siteActivityId") REFERENCES "public"."siteActivity1"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityEquipment1" ADD CONSTRAINT "siteActivityEquipment1_equipmentId_equipments1_id_fk" FOREIGN KEY ("equipmentId") REFERENCES "public"."equipments1"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityMaterials1" ADD CONSTRAINT "siteActivityMaterials1_siteActivityId_siteActivity1_id_fk" FOREIGN KEY ("siteActivityId") REFERENCES "public"."siteActivity1"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteActivityMaterials1" ADD CONSTRAINT "siteActivityMaterials1_materialId_materials1_id_fk" FOREIGN KEY ("materialId") REFERENCES "public"."materials1"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportActivity1" ADD CONSTRAINT "siteReportActivity1_siteReportId_siteReports1_id_fk" FOREIGN KEY ("siteReportId") REFERENCES "public"."siteReports1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportActivity1" ADD CONSTRAINT "siteReportActivity1_siteActivityId_siteActivity1_id_fk" FOREIGN KEY ("siteActivityId") REFERENCES "public"."siteActivity1"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_uuid_siteReports1_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "public"."siteReports1"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_uuid_sites1_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "public"."sites1"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "equipments1" DROP COLUMN IF EXISTS "equipmentListId";--> statement-breakpoint
ALTER TABLE "logs1" DROP COLUMN IF EXISTS "noticeId";--> statement-breakpoint
ALTER TABLE "logs1" DROP COLUMN IF EXISTS "meetingId";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "inventoryMaterialsListId";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "inventoryEquipmentListId";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "siteActivityListId";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "contractors";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "engineers";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "visitors";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "activity";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "workers";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "materialsUsed";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "equipmentUsed";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "materialsInventory";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "equipmentInventory";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "usedMaterialsListId";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "usedEquipmentListId";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "budget";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "spent";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "timeline";--> statement-breakpoint
ALTER TABLE "siteReportDetails1" DROP COLUMN IF EXISTS "completionDate";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "ownerName";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "ownerPhone";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "ownerEmail";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "architectName";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "architectPhone";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "architectEmail";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "managerName";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "managerPhone";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "managerEmail";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "contractorName";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "contractorPhone";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "contractorEmail";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "supervisorName";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "supervisorPhone";--> statement-breakpoint
ALTER TABLE "siteDetails1" DROP COLUMN IF EXISTS "supervisorEmail";--> statement-breakpoint
ALTER TABLE "materials1" DROP COLUMN IF EXISTS "materialsListId";--> statement-breakpoint
ALTER TABLE "materials1" DROP COLUMN IF EXISTS "cost";--> statement-breakpoint
ALTER TABLE "materials1" DROP COLUMN IF EXISTS "costUnits";--> statement-breakpoint
ALTER TABLE "siteActivity1" DROP COLUMN IF EXISTS "siteActivityListId";--> statement-breakpoint
ALTER TABLE "siteActivity1" DROP COLUMN IF EXISTS "usedMaterialsListId";--> statement-breakpoint
ALTER TABLE "siteActivity1" DROP COLUMN IF EXISTS "usedEquipmentListId";--> statement-breakpoint
ALTER TABLE "commentsSections1" ADD CONSTRAINT "commentsSections1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "fileGroups1" ADD CONSTRAINT "fileGroups1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "feedback1" ADD CONSTRAINT "feedback1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "equipments1" ADD CONSTRAINT "equipments1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "files1" ADD CONSTRAINT "files1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "siteInvitations1" ADD CONSTRAINT "siteInvitations1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "siteReportDetails1" ADD CONSTRAINT "siteReportDetails1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "siteDetails1" ADD CONSTRAINT "siteDetails1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "siteReportSections1" ADD CONSTRAINT "siteReportSections1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "siteReports1" ADD CONSTRAINT "siteReports1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "comments1" ADD CONSTRAINT "comments1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "materials1" ADD CONSTRAINT "materials1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "siteActivity1" ADD CONSTRAINT "siteActivity1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "sites1" ADD CONSTRAINT "sites1_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
DROP TYPE "public"."siteMeetingStatus";