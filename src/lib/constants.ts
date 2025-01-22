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
  if (!countryCode) return null;
  try {
    // Create a locale using the country code
    const locale = new Intl.Locale("en-" + countryCode);
    const currency = new Intl.NumberFormat(locale.baseName, {
      style: "currency",
      currencyDisplay: "name",
    }).resolvedOptions().currency;
    return currency;
  } catch (error) {
    console.error("Error retrieving currency:", error);
    return null;
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
