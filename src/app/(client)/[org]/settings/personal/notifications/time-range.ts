export function convertTo24Hour(time: string): string | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const minutes = Number(match[2]);
  if (hour < 1 || hour > 12 || minutes > 59) return null;
  const suffix = match[3].toUpperCase();
  if (suffix === "PM" && hour !== 12) hour += 12;
  if (suffix === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${match[2]}`;
}

export function parseStoredTimeRange(
  value: unknown
): { from: string; to: string } | null {
  if (typeof value !== "string") return null;
  const parts = value.split(" - ");
  if (parts.length !== 2) return null;
  const from = convertTo24Hour(parts[0]);
  const to = convertTo24Hour(parts[1]);
  if (from === null || to === null) return null;
  return { from, to };
}
