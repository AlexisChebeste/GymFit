import { BodyMeasurement } from "@/types/types";
import { isWithinDays } from "../date";

export function buildMeasurementsTimeline(
  measurements: BodyMeasurement[],
  range: "7D" | "30D" | "90D"
) {

  const sorted = [...measurements].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  const days =
    range === "7D"
      ? 7
      : range === "30D"
      ? 30
      : 90;

  const filtered = sorted.filter(m =>
    isWithinDays(m.date, days)
  );

  return {
    sorted,
    filtered,
    latest: sorted.at(-1) || null,
    first: filtered[0] || null
  };
}