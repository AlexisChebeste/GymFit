
import { BodyMeasurement } from "@/types/types";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "body_measurements";

function getMeasurements() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMeasurements(data: BodyMeasurement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export type Trend = "up_good" | "down_good" | "neutral";

export function useMeasurements(range: "7D" | "30D" | "90D") {

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);

  useEffect(() => {
    setMeasurements(getMeasurements());
  }, []);

  const addMeasurement = (newMeasurement: BodyMeasurement) => {
    const updated = [...measurements, newMeasurement].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setMeasurements(updated);
    saveMeasurements(updated);
  };

  function filterByRange(date: string, range: string) {
    const d = new Date(date);

    if (isNaN(d.getTime())) return false; 

    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (range === "7D") return diffDays <= 7;
    if (range === "30D") return diffDays <= 30;
    if (range === "90D") return diffDays <= 90;
    return true;
  }

  const sorted = useMemo(() => {
    return [...measurements].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [measurements]);

  const filtered = sorted.filter(m => filterByRange(m.date, range));

  const latest = sorted.length > 0 ? sorted[sorted.length - 1] : null;

  const weightProgress = (() => {
    if (sorted.length < 2) return 0;

    const first = sorted[0].weight ?? 0;
    const last = latest ? latest.weight ?? 0 : 0;

    if (!first) return 0;

    return ((last - first) / first) * 100;
  })();

  function getChange(field: keyof BodyMeasurement) {
    if (filtered.length < 2) return 0;

    const last = filtered[0];
    const first = filtered[filtered.length - 1];

    return ((first[field] as number) ?? 0) - ((last[field] as number) ?? 0);
  }

  const change = getChange("weight");

  function getTrend(value: number, inverse = false): Trend {
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
        key: "arm",
        label: "Brazo",
        unit: "cm",
        value: latest.arm,
        change: getChange("arm"),
        trend: getTrend(getChange("arm"))
      },
      {
        key: "bodyFat",
        label: "% Grasa",
        unit: "%",
        value: latest.bodyFat,
        change: getChange("bodyFat"),
        trend: getTrend(getChange("bodyFat"), true)
      },
      {
        key: "leg",
        label: "Pierna",
        unit: "cm",
        value: latest.leg,
        change: getChange("leg"),
        trend: getTrend(getChange("leg"))
      },
    ];
  }, [filtered, latest]);

  const updateMeasurement = (updated: BodyMeasurement) => {
    const newData = measurements.map(m =>
      m.id === updated.id ? updated : m
    );

    setMeasurements(newData);
    saveMeasurements(newData);
  };

  const getPrefill : () => BodyMeasurement = () => {
    return {
      ...latest,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      userId: latest?.userId || "",
      weight: latest?.weight ?? 0,
      bodyFat: latest?.bodyFat ?? 0,
      chest: latest?.chest ?? 0,
      waist: latest?.waist ?? 0,
      arm: latest?.arm ?? 0,
      leg: latest?.leg ?? 0,
    };
  };

  return {
    latest,
    change,
    weightProgress,
    addMeasurement,
    history: filtered,
    metrics,
    updateMeasurement,
    getPrefill
  };
}