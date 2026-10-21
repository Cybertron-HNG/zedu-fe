const to24Hour = (time: string): string | null => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let h = Number(match[1]);
  const m = Number(match[2]);
  const suffix = match[3].toUpperCase();
  if (h < 1 || h > 12 || m > 59) return null;
  if (suffix === "PM" && h !== 12) h += 12;
  if (suffix === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export const parseStoredTimeRange = (
  timeRange: string | undefined
): { from: string; to: string } | null => {
  if (!timeRange) return null;
  const parts = timeRange.split(" - ");
  if (parts.length !== 2) return null;
  const from = to24Hour(parts[0]);
  const to = to24Hour(parts[1]);
  if (!from || !to) return null;
  return { from, to };
};
