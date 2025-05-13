import { SiteMemberRole } from "./types";

export const demoSiteIds: number[] = [1];

export const maxSiteInvitations = 10;

export const supportedCountries = [
  "GH",
  "GM",
  "KE",
  "NG",
  "SL",
  "ZM",
];

export const currencies = [
  "CNY",
  "EUR",
  "GBP",
  "GHS",
  "GMD",
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
