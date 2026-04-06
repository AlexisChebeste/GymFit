import { BodyMeasurement } from "@/types/types";

export const mesaurementsMock: BodyMeasurement[] = [
  {
    id: "1",
    userId: "user123",
    date: "2026-03-01",
    weight: 73.5,
    bodyFat: 18.2,
    waist: 85,
    chest: 100,
    arm: 30,
    leg: 50,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "2",
    userId: "user123",
    date: "2026-03-15",
    weight: 73.0,
    bodyFat: 18.0,
    waist: 84,
    chest: 100,
    arm: 30,
    leg: 50,
    createdAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "3",
    userId: "user123",
    date: "2026-04-01",
    weight: 72.5,
    bodyFat: 17.8,
    waist: 83,
    chest: 100,
    arm: 30,
    leg: 50,
    createdAt: "2026-04-01T10:00:00Z",
  },
];


export function useMeasurements(measurements: BodyMeasurement[], range: "7D" | "30D" | "90D") {

  function filterByRange(date: string, range: string) {
    const d = new Date(date);

    if (isNaN(d.getTime())) return false; 

    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

    if (range === "7D") return diffDays <= 7;
    if (range === "30D") return diffDays <= 30;
    if (range === "90D") return diffDays <= 90;
    return true;
  }

  const sorted = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const filtered = sorted.filter(m => filterByRange(m.date, range));

  const latest = sorted[sorted.length - 1];

  const previous = sorted.at(-2)?.weight ?? null;

  const change = latest.weight && previous
    ? latest.weight - previous
    : null;

  const weightProgress = (() => {
    if (sorted.length < 2) return 0;

    const first = sorted[0].weight ?? 0;
    const last = latest.weight ?? 0;

    return ((last - first) / first) * 100;
  })();

  return {
    latest,
    change,
    weightProgress,
    history: filtered
  };
}