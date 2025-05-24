"use server";

import * as db from "@/db";
import { editReportRoles, viewSiteRoles } from "../permissions";
import { getSiteMemberRole } from "./sites";

export async function updateFile({
  fileId,
  filename,
}: {
  fileId: number;
  filename: string;
}) {
  const role = await getSiteMemberRole({ fileId });
  if (editReportRoles.includes(role))
    return db.updateFile({ fileId }, { filename });
}
