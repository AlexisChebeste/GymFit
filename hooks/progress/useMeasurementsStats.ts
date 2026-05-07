import { BodyMeasurement, UserProfile } from "@/types/types";
import { useMemo } from "react";
import { isWithinDays } from "@/lib/date";
import { Trend } from "./useMeasurements";

export function useMeasurementStats(
  measurements: BodyMeasurement[],
  profile: UserProfile,
  range: "7D" | "30D" | "90D"
) {

  function getSessionIMC(weight: number, height: number) {
    if (!height) return 0;
    const h = height / 100;
    return weight / (h * h);
  }

  const sorted = useMemo(() => {
    return [...measurements].sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [measurements]);

  const filtered = useMemo(() => {
    const days = range === "7D" ? 7 : range === "30D" ? 30 : 90;
    return sorted.filter(m => isWithinDays(m.date, days));
  }, [sorted, range]);

  const latest = sorted.at(-1) || null;

  
  const weightProgress = (() => {
    if (sorted.length < 2) return 0;

    const first = sorted[0].weight ?? 0;
    const last = latest ? latest.weight ?? 0 : 0;

    if (!first) return 0;

    return ((last - first) / first) * 100;
  })();
  

  function getChange(field: keyof BodyMeasurement) {
    if (filtered.length < 2) return 0;

    const first = filtered[0];
    const last = filtered.at(-1)!;

    return (last[field] as number) - (first[field] as number);
  }

  function getTrend(value: number, inverse = false) {
    if (value === 0) return "neutral";
    if (inverse) return value < 0 ? "up_good" : "down_good";
    return value > 0 ? "up_good" : "down_good";
  }

  const metrics = useMemo(() => {
    if (!latest) return [];

    return [
      {
        key: "waist",
        label: "Cintura",
        unit: "cm",
        value: latest.waist,
        change: getChange("waist"),
        trend: getTrend(getChange("waist"), true)
      },
      {
        key: "chest",
        label: "Pecho",
        unit: "cm",
        value: latest.chest,
        change: getChange("chest"),
        trend: getTrend(getChange("chest"))
      },
      {
        key: "left_arm",
        label: "Brazo (izq.)",
        unit: "cm",
        value: latest.left_arm,
        change: getChange("left_arm"),
        trend: getTrend(getChange("left_arm"))
      },
      {
        key: "right_arm",
        label: "Brazo (der.)",
        unit: "cm",
        value: latest.right_arm,
        change: getChange("right_arm"),
        trend: getTrend(getChange("right_arm"))
      },
      {
        key: "left_leg",
        label: "Pierna (izq.)",
        unit: "cm",
        value: latest.left_leg,
        change: getChange("left_leg"),
        trend: getTrend(getChange("left_leg"))
      },
      {
        key: "right_leg",
        label: "Pierna (der.)",
        unit: "cm",
        value: latest.right_leg,
        change: getChange("right_leg"),
        trend: getTrend(getChange("right_leg"))
      },
      {
        key: "body_fat",
        label: "% Grasa",
        unit: "%",
        value: latest.body_fat,
        change: getChange("body_fat"),
        trend: getTrend(getChange("body_fat"), true)
      },
      {
        key: "imc",
        label: "IMC",
        unit: "Índice",
        value: getSessionIMC(latest.weight, profile.height) as Number,
        change: 0,
        trend: "neutral" as Trend
      }
    ];
  }, [filtered, latest]);
  
  const progress = latest && profile?.weight_goal
  ? latest.weight > profile.weight_goal
    ? Math.min(profile.weight_goal / (latest.weight / 100), 100)
    : Math.min((latest.weight / profile.weight_goal) * 100, 100)
  : null;

  const getPrefill : () => BodyMeasurement = () => {
    return {
      ...latest,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      user_id: profile.id,
      weight: latest?.weight ?? 0,
      body_fat: latest?.body_fat ?? 0,
      chest: latest?.chest ?? 0,
      waist: latest?.waist ?? 0,
      left_arm: latest?.left_arm ?? 0,
      right_arm: latest?.right_arm ?? 0,
      left_leg: latest?.left_leg ?? 0,
      right_leg: latest?.right_leg ?? 0,
    };
  };

  return {
    latest,
    change: getChange("weight"),
    history: filtered,
    metrics,
    weightProgress,
    progress,
    getPrefill
  };
}