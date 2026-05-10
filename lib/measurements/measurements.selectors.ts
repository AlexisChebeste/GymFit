import { BodyMeasurement, Trend, UserProfile } from "@/types/types";
import { isWithinDays } from "../date";


export function getMeasurementsSorted(measurements: BodyMeasurement[]) {
  return [...measurements].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getLatestMeasurement(measurements: BodyMeasurement[]) {
  return measurements.at(-1) || null;
}

export function getMeasurementFiltered(measurements: BodyMeasurement[], range: "7D" | "30D" | "90D") {
  const days = range === "7D" ? 7 : range === "30D" ? 30 : 90;
  return measurements.filter(m => isWithinDays(m.date, days));
}

export function getWeightProgress(measurements: BodyMeasurement[]) {
  if (measurements.length < 2) return 0;

    const first = measurements[0].weight ?? 0;  
    const last = measurements.at(-1)?.weight ?? 0;

    if (!first) return 0;

    return ((last - first) / first) * 100;
}

export function getChange(field: keyof BodyMeasurement, measurements: BodyMeasurement[]) {
  if (measurements.length < 2) return 0;

    const first = measurements[0];
    const last = measurements.at(-1)!;

    return (last[field] as number) - (first[field] as number);
}

export function getTrend(value: number, inverse = false) {
    if (value === 0) return "neutral";
    if (inverse) return value < 0 ? "up_good" : "down_good";
    return value > 0 ? "up_good" : "down_good";
}

export function getSessionIMC(weight: number, height: number) {
    if (!height) return 0;
    const h = height / 100;
    return weight / (h * h);
  }


export function getMetrics(measurement: BodyMeasurement | null, measurements: BodyMeasurement[], profile: UserProfile) {
    if (!measurement) return [];

    return [
      {
        key: "waist",
        label: "Cintura",
        unit: "cm",
        value: measurement.waist,
        change: getChange("waist", measurements),
        trend: getTrend(getChange("waist", measurements), true)
      },
      {
        key: "chest",
        label: "Pecho",
        unit: "cm",
        value: measurement.chest,
        change: getChange("chest", measurements),
        trend: getTrend(getChange("chest", measurements))
      },
      {
        key: "left_arm",
        label: "Brazo (izq.)",
        unit: "cm",
        value: measurement.left_arm,
        change: getChange("left_arm", measurements),
        trend: getTrend(getChange("left_arm", measurements))
      },
      {
        key: "right_arm",
        label: "Brazo (der.)",
        unit: "cm",
        value: measurement.right_arm,
        change: getChange("right_arm", measurements),
        trend: getTrend(getChange("right_arm", measurements))
      },
      {
        key: "left_leg",
        label: "Pierna (izq.)",
        unit: "cm",
        value: measurement.left_leg,
        change: getChange("left_leg", measurements),
        trend: getTrend(getChange("left_leg", measurements))
      },
      {
        key: "right_leg",
        label: "Pierna (der.)",
        unit: "cm",
        value: measurement.right_leg,
        change: getChange("right_leg", measurements),
        trend: getTrend(getChange("right_leg", measurements))
      },
      {
        key: "body_fat",
        label: "% Grasa",
        unit: "%",
        value: measurement.body_fat,
        change: getChange("body_fat", measurements),
        trend: getTrend(getChange("body_fat", measurements), true)
      },
      {
        key: "imc",
        label: "IMC",
        unit: "Índice",
        value: getSessionIMC(measurement.weight, profile.height) as number,
        change: 0,
        trend: "neutral" as Trend
      }
    ];
  }

