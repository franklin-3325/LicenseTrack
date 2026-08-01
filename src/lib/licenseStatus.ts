export type LicenseStatus = "expired" | "critical" | "warning" | "ok";

export const STATUS_LABEL: Record<LicenseStatus, string> = {
  expired: "Expired",
  critical: "Expires soon",
  warning: "Renew soon",
  ok: "Active",
};

// Tailwind class groups, kept together so a badge's colors never end up mismatched.
export const STATUS_CLASSES: Record<LicenseStatus, string> = {
  expired: "bg-red-100 text-red-800 border-red-300",
  critical: "bg-orange-100 text-orange-800 border-orange-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  ok: "bg-green-100 text-green-800 border-green-300",
};

export function daysUntil(date: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

export function getLicenseStatus(expirationDate: Date): LicenseStatus {
  const days = daysUntil(expirationDate);
  if (days < 0) return "expired";
  if (days <= 30) return "critical";
  if (days <= 90) return "warning";
  return "ok";
}
