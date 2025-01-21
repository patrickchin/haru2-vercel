import { SiteMemberRole } from "./types";

export const demoSiteIds: number[] = [21];

export const maxSiteInvitations = 5;

export const supportedCountries = ["NG", "SL", "GH", "KE", "ZM"];

export const getCountryCurrency = (countryCode: string | null) => {
  if (!countryCode) return;
  const currencyMap: Record<string, string> = {
    NG: "NGN",
    SL: "SLL",
    GH: "GHS",
    KE: "KES",
    ZM: "ZMW",
  };
  if (countryCode in currencyMap) {
    return currencyMap[countryCode];
  }
}

export function getRoleName(role: SiteMemberRole) {
  if (!role) return role;
  const roleNames: Record<NonNullable<SiteMemberRole>, string> = {
    manager: "Project Manager",
    architect: "Architect",
    supervisor: "Supervisor",
    owner: "Owner",
    contractor: "Contractor",
    member: "Member",
  };
  return roleNames[role];
}
