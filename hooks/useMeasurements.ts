import { BodyMeasurement } from "@/types/types";

export function useMeasurements(measurements: BodyMeasurement[]) {

  const sorted = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latest = sorted[sorted.length - 1];

  const weightProgress = (() => {
    if (sorted.length < 2) return 0;

    const first = sorted[0].weight ?? 0;
    const last = latest.weight ?? 0;

    return ((last - first) / first) * 100;
  })();

  return {
    latest,
    weightProgress,
    history: sorted
  };
}