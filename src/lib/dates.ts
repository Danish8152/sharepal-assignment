const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return n + "th";
  return n + (["th", "st", "nd", "rd"][n % 10] ?? "th");
}

/** "2026-10-08" -> "8th Oct" */
export function formatShort(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${ordinal(d)} ${MONTHS_SHORT[m - 1]}`;
}

export function toISO(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
