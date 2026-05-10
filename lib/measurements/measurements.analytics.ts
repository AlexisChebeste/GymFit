import { BodyMeasurement, MetricKey, Trend, UserProfile } from "@/types/types";
import { MEASUREMENT_CONFIG } from "./measurements.config";

function getTrend(
  value: number,
  inverse = false
): Trend {

  if (value === 0) return "neutral";

  if (inverse) {
    return value < 0
      ? "up_good"
      : "down_good";
  }

  return value > 0
    ? "up_good"
    : "down_good";
}

function calculateIMC(
  weight: number,
  height: number
) {
  if (!height) return 0;

  const h = height / 100;

  return weight / (h * h);
}

export function buildMeasurementsAnalytics(
  first: BodyMeasurement | null,
  latest: BodyMeasurement | null,
  profile: UserProfile
) {

  if (!first || !latest) {
    return {
      metrics: [],
      weightProgress: 0,
      progress: null
    };
  }

  const metrics = (
    Object.keys(MEASUREMENT_CONFIG) as MetricKey[]
  ).map(key => {

    const config = MEASUREMENT_CONFIG[key];

    const value = latest[key] ?? 0;

    const change =
      (latest[key] ?? 0) -
      (first[key] ?? 0);

    return {
      key,
      label: config.label,
      unit: config.unit,
      value,
      change,
      trend: getTrend(
        change,
        config.inverse
      )
    };
  });

  const weightProgress =
    ((latest.weight - first.weight) /
      first.weight) *
    100;

  const progress =
    latest && profile.weight_goal
      ? latest.weight > profile.weight_goal
        ? Math.min(
            profile.weight_goal /
              (latest.weight / 100),
            100
          )
        : Math.min(
            (latest.weight /
              profile.weight_goal) *
              100,
            100
          )
      : null;

  return {
    metrics: [
      ...metrics,
      {
        key: "imc",
        label: "IMC",
        unit: "Índice",
        value: calculateIMC(
          latest.weight,
          profile.height
        ).toFixed(2),
        change: 0,
        trend: "neutral"
      }
    ],

    weightProgress,
    progress
  };
}