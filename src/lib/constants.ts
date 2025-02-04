import { SiteMemberRole } from "./types";

export const demoSiteIds: number[] = [21];

export const maxSiteInvitations = 5;

export const supportedCountries = ["GH", "KE", "NG", "SL", "ZM"];

export const currencies = [
  "CNY",
  "EUR",
  "GBP",
  "GHS",
  "KES",
  "NGN",
  "SLL",
  "USD",
  "ZMW",
];

export function getCountryCurrency(countryCode: string | null) {
  if (!countryCode) return;
  try {
    // Create a locale using the country code
    const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
    const currency = displayNames.of(countryCode);
    return currency;
  } catch (error) {
    return;
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
