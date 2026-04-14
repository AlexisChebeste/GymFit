
import { supabase } from "@/lib/supabaseClient";
import { BodyMeasurement, UserProfile } from "@/types/types";
import { useEffect, useMemo, useState } from "react";

export type Trend = "up_good" | "down_good" | "neutral";

export function useMeasurements(userId: string, profile: UserProfile, range: "7D" | "30D" | "90D" = "30D") {

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchMeasurements = async () => {
      const {data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("user_id", userId)

      if (error) {
        console.error("Error fetching routine:", error);
      } else {
        setMeasurements(data || []);
      }
      setIsLoading(false);
    };

    fetchMeasurements();
  }, [userId]);

  const addMeasurement = async (newMeasurement: BodyMeasurement) => {

    const measurement = {
      ...newMeasurement,
      user_id: userId
    }

    const { error } =  await supabase      
      .from("measurements")
      .insert(measurement);

    if (error) {
      throw new Error("Error saving measurement: " + error.message);
    }

    const updated = [...measurements, measurement].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setMeasurements(updated);

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
        key: "body_fat",
        label: "% Grasa",
        unit: "%",
        value: latest.body_fat,
        change: getChange("body_fat"),
        trend: getTrend(getChange("body_fat"), true)
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
    ];
  }, [filtered, latest]);

  const updateMeasurement = async (updated: BodyMeasurement) => {
    const newData = measurements.map(m =>
      m.id === updated.id ? updated : m
    );

    setMeasurements(newData);
    
    const { error } = await supabase
      .from("measurements")
      .update(updated)
      .eq("id", updated.id);

    if (error) {
      console.error("Error updating measurement:", error);
      throw new Error("Error updating measurement: " + error.message);  
    }
  };

  const getPrefill : () => BodyMeasurement = () => {
    return {
      ...latest,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      user_id: userId,
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

  const progress = latest && profile?.weight_goal
  ? latest.weight > profile.weight_goal
    ? Math.min(profile.weight_goal / (latest.weight / 100), 100)
    : Math.min((latest.weight / profile.weight_goal) * 100, 100)
  : null;

  return {
    latest,
    change,
    weightProgress,
    addMeasurement,
    history: filtered,
    metrics,
    updateMeasurement,
    getPrefill,
    progress
  };
}