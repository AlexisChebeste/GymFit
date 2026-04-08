import { Routine, WorkoutSession } from "@/types/types";
import { useMemo } from "react";

export function useWeeklyStats(
  routine: Routine | null,
  sessions: WorkoutSession[]
) {
  return useMemo(() => {
    if (!routine) {
      return {
        completionRate: 0,
        missedWorkouts: 0,
        progressWeek: 0
      };
    }

    const now = new Date();

    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const sessionsThisWeek = sessions.filter(s => {
      const date = new Date(s.date);
      return date >= startOfWeek && date < endOfWeek;
    });

    const trainedDays = new Set(
      sessionsThisWeek.map(s => {
        const d = new Date(s.date).getDay();
        return d === 0 ? 6 : d ; // lo pasamos a formato lunes=0
      })
    );

    const plannedDays = routine.days.map(d => d.day);

    const completed = plannedDays.filter(d => trainedDays.has(d)).length;
    
    const completionRate =
      plannedDays.length === 0
        ? 0
        : (completed / plannedDays.length) * 100;

    const today = now.getDay() === 0 ? 6 : now.getDay() - 1;

    const missedWorkouts = plannedDays.filter(
      d => d <= today && !trainedDays.has(d)
    ).length;

    return {
      completionRate,
      missedWorkouts,
    };
  }, [routine, sessions]);
}