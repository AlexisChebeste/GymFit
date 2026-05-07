import { Routine, WorkoutSession } from "@/types/types";
import { useMemo } from "react";
import { toLocalISO } from "@/lib/date";

function getLocalDay(date: Date) {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1; // lunes = 0
}

export function useWeeklyStats(
  routine: Routine | null,
  sessions: WorkoutSession[]
) {
  return useMemo(() => {
    const now = new Date();

    const monday = new Date(now);
    const day = getLocalDay(now);
    monday.setDate(now.getDate() - day);
    monday.setHours(0, 0, 0, 0);

    const daysData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dateKey = toLocalISO(d);

      return {
        date: d,
        dateKey,
        isToday: toLocalISO(d) === toLocalISO(now),
        hasTrained: sessions.some(s => s.date === dateKey),
        isPlanned: routine?.days.some(rd => rd.day === i) ?? false
      };
    });

    const plannedCount = routine?.days.length || 0;
    const trainedCount = daysData.filter(d => d.hasTrained).length;

    const completionRate =
      plannedCount === 0 ? 0 : (trainedCount / plannedCount) * 100;

    return {
      daysData,
      completionRate: Number(Math.min(completionRate, 100).toFixed(1)),
    };
  }, [routine, sessions]);
}