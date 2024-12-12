"use server";

import * as db from "@/db";
import { auth } from "@/lib/auth";
import { zSiteNewBoth, zSiteNewBothType } from "@/lib/forms";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  editSiteRoles,
  editMeetingRoles,
  viewSiteRoles,
  acceptMeetingRoles,
} from "@/lib/permissions";
import { demoSiteIds, maxSiteInvitations } from "@/lib/constants";
import {
  SiteDetailsNew,
  SiteMeetingNew,
  SiteMemberRole,
  SiteNew,
} from "@/lib/types";
import { Session } from "next-auth";
import { sendEmail } from "../email";
import { SiteInvitationLimitReached } from "../errors";

export async function addSite(data: zSiteNewBothType) {
  const session = await auth();
  if (!session?.user) return;
  const parsed = zSiteNewBoth.safeParse(data);
  if (!parsed.success) return;
  const site = await db.addSite(session.user.idn, parsed.data);
  redirect(`/sites/${site.id}?dialog=editMembersBar`);
}

export async function getMySites() {
  const session = await auth();
  if (!session?.user) return;
  return db.getMySites(session.user.idn);
}

export async function getAllVisibleSites() {
  const session = await auth();
  if (!session?.user) return;
  if (session?.user.role === "admin") {
    return db.getAllSites(session.user.idn);
  }
  return db.getAllVisibleSites(session.user.idn);
}

export async function getSiteDetails(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  const role = await getSiteMemberRole({ siteId }, session);
  if (viewSiteRoles.includes(role)) {
    return db.getSiteDetails({ siteId });
  }
}

export async function updateSite(siteId: number, data: SiteNew) {
  const role = await getSiteMemberRole({ siteId });
  if (editSiteRoles.includes(role)) {
    const updated = await db.updateSite(siteId, data);
    revalidatePath(`/sites/${siteId}`);
    return updated;
  }
}

export async function updateSiteDetails(
  siteId: number,
  details: SiteDetailsNew,
) {
  const role = await getSiteMemberRole({ siteId });
  if (editSiteRoles.includes(role)) {
    const updated = await db.updateSiteDetails(siteId, details);
    revalidatePath(`/sites/${siteId}`);
    return updated;
  }
}

export async function listSiteMembers(siteId: number) {
  const session = await auth();
  const role = await getSiteMemberRole({ siteId }, session);
  if (demoSiteIds.includes(siteId)) {
    if (session?.user?.role === "admin")
      return db.listSiteMembers(siteId, true);
    return db.listSiteMembers(siteId, false);
  }
  if (editSiteRoles.includes(role)) {
    return db.listSiteMembers(siteId, true);
  }

  if (viewSiteRoles.includes(role)) {
    // don't show all members in demo site project
    const includeBasicMembers = !demoSiteIds.includes(siteId);
    return db.listSiteMembers(siteId, includeBasicMembers);
  }
}

export async function getSiteRole(siteId: number) {
  const session = await auth();
  if (!session?.user) return;
  return db.getSiteRole({ siteId, userId: session.user.idn });
}

export async function getSiteNotices(siteId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ siteId })))
    return db.getSiteNotices(siteId);
}

export async function listSiteMeetings(siteId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ siteId })))
    return db.listSiteMeetings(siteId);
}

export async function getSiteMeeting(meetingId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ meetingId })))
    return db.getSiteMeeting(meetingId);
}

export async function addSiteMeeting(siteId: number, values: SiteMeetingNew) {
  const session = await auth();
  const role = await getSiteMemberRole({ siteId }, session);
  if (editMeetingRoles.includes(role))
    return db.addSiteMeeting({ siteId, userId: session?.user?.idn }, values);
}

export async function updateSiteMeeting(
  meetingId: number,
  values: SiteMeetingNew,
) {
  // TODO only _we_ should be able to confirm a meeting with ourselves lol
  const role = await getSiteMemberRole({ meetingId });
  if (editMeetingRoles.includes(role) || acceptMeetingRoles.includes(role)) {
    return db.updateSiteMeeting(meetingId, values);
  }
}

export async function updateSiteMeetingReturnAllMeetings(
  meetingId: number,
  values: SiteMeetingNew,
) {
  // TODO split this into two functions ... or not
  const role = await getSiteMemberRole({ meetingId });
  if (editMeetingRoles.includes(role) || acceptMeetingRoles.includes(role)) {
    const meeting = await db.updateSiteMeeting(meetingId, values);
    return meeting.siteId ? db.listSiteMeetings(meeting.siteId) : [meeting];
  }
}

export async function deleteSiteMeeting(meetingId: number) {
  const role = await getSiteMemberRole({ meetingId });
  if (editSiteRoles.includes(role)) return db.deleteSiteMeeting(meetingId);
}

export async function deleteSiteMeetingReturnAllMeetings(meetingId: number) {
  const role = await getSiteMemberRole({ meetingId });
  if (editSiteRoles.includes(role)) {
    const meeting = await db.deleteSiteMeeting(meetingId);
    return meeting.siteId ? db.listSiteMeetings(meeting.siteId) : [meeting];
  }
}

async function addSiteMemberInvite({
  siteId,
  email,
  name,
}: {
  siteId: number;
  email?: string;
  name?: string | null;
}) {
  const maxNameLen = 20;
  const cutName =
    name && name.length > maxNameLen
      ? name.substring(0, maxNameLen - 3) + "..."
      : name;
  const emailBody = `Dear Sir/Madam,

${cutName} has registered his/her construction project on Harpa Pro
(https://harpapro.com) and invites you to join the platform to recieve updates
on the project's progress!

Kind Regards,
The Harpa Pro Team.
`;

  const nInv = await db.countSiteInvitations(siteId);
  if (nInv < maxSiteInvitations) {
    await db.addSiteInvitation(siteId, { email });
    const sendInvitationEmail = false;

    if (sendInvitationEmail && email && name) {
      sendEmail({
        from: "noreply@harpapro.com",
        to: email,
        subject: `${name} has invited you to Harpa Pro`,
        body: emailBody,
      });
    }
  } else {
    return SiteInvitationLimitReached;
  }
}

export async function addSiteMemberByEmail({
  siteId,
  email,
}: {
  siteId: number;
  email: string;
}) {
  const session = await auth();
  const role = await getSiteMemberRole({ siteId }, session);
  if (editSiteRoles.includes(role)) {
    const user = await db.getUserByEmail(email);
    if (user) {
      db.addSiteMember({ siteId, userId: user.id, role: "member" });
    } else {
      return addSiteMemberInvite({ siteId, email, name: session?.user?.name });
    }
  }
}

export async function updateSiteMemberRole({
  siteId,
  userId,
  role,
}: {
  siteId: number;
  userId: number;
  role: SiteMemberRole;
}) {
  if (editSiteRoles.includes(await getSiteMemberRole({ siteId }))) {
    return db.updateSiteMemberRole({ siteId, userId, role });
  }
}

export async function removeSiteMember({
  siteId,
  userId,
}: {
  siteId: number;
  userId: number;
}) {
  if (editSiteRoles.includes(await getSiteMemberRole({ siteId }))) {
    const n = await db.countSiteMembers(siteId);
    if (n > 1) return db.removeSiteMember({ siteId, userId });
  }
}

export async function getSiteCommentsSection(siteId: number) {
  if (viewSiteRoles.includes(await getSiteMemberRole({ siteId }))) {
    return db.ensureSiteCommentsSection(siteId);
  }
}

export async function getSiteMemberRole(
  {
    siteId,
    reportId,
    sectionId,
    meetingId,
    invitationId,
    commentsSectionId,
  }: {
    siteId?: number;
    reportId?: number;
    sectionId?: number;
    meetingId?: number;
    invitationId?: number;
    commentsSectionId?: number;
  },
  session?: Session | null,
): Promise<SiteMemberRole> {
  const s = session === undefined ? await auth() : session;
  if (!s?.user) return null;

  const userId = s.user.idn;
  let role: SiteMemberRole = null;
  if (siteId) {
    role = await db.getSiteRole({ siteId, userId });
  } else if (reportId) {
    role = await db.getReportRole({ reportId, userId });
  } else if (sectionId) {
    role = await db.getReportSectionRole({ sectionId, userId });
  } else if (meetingId) {
    role = await db.getMeetingRole({ meetingId, userId });
  } else if (commentsSectionId) {
    role = await db.getCommentsSectionRole({ commentsSectionId, userId });
  } else if (invitationId) {
    role = await db.getInvitationRole({ invitationId, userId });
  }
  if (!role) {
    if (s.user.role === "admin") return "supervisor";
  }
  return role;
}

export async function listSiteInvitations(siteId: number) {
  const session = await auth();
  const role = await getSiteMemberRole({ siteId }, session);
  if (editSiteRoles.includes(role)) {
    return db.listSiteInvitations(siteId);
  }
}

export async function deleteSiteInvitation(invitationId: number) {
  const session = await auth();
  const role = await getSiteMemberRole({ invitationId }, session);
  if (editSiteRoles.includes(role)) {
    return db.deleteSiteInvitation(invitationId);
  }
}
