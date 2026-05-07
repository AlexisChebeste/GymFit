export function toLocalISO(date: Date | string) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameDay(a: string | Date, b: string | Date) {
  return toLocalISO(a) === toLocalISO(b);
}

export function isWithinDays(date: string | Date, days: number) {
  const now = new Date();
  const d = new Date(date);

  const diff =
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

  return diff <= days;
}

export function getLocalDay(date: Date) {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
}