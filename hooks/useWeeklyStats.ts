import { Routine, WorkoutSession } from "@/types/types";
import { useMemo } from "react";

function toLocalDateString(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getWeekRange() {
  const now = new Date();

  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;

  const start = new Date(now);
  start.setDate(now.getDate() + diff);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return {
    start: toLocalDateString(start),
    end: toLocalDateString(end),
  };
}

function getLocalDay(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day); // LOCAL

  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1; // lunes = 0
}

export function useWeeklyStats(
  routine: Routine | null,
  sessions: WorkoutSession[]
) {
  return useMemo(() => {
    if (!routine) {
      return {
        completionRate: 0,
        missedWorkouts: 0,
      };
    }

    const { start, end } = getWeekRange();

    const sessionsThisWeek = sessions.filter(
      (s) => s.date >= start && s.date < end
    );

    const trainedDays = new Set(
      sessionsThisWeek.map((s) => getLocalDay(s.date))
    );

    const plannedDays = routine.days.map(d => {
      const day = d.day;

      // si viene 1–7 (lunes=1, domingo=7)
      return day === 7 ? 6 : day - 1;
    });

    const completed = plannedDays.filter((d) =>
      trainedDays.has(d)
    ).length;

    const completionRate =
      plannedDays.length === 0
        ? 0
        : (completed / plannedDays.length) * 100;

    // hoy en formato lunes = 0
    const now = new Date();
    const today = now.getDay() === 0 ? 6 : now.getDay() - 1;

    const missedWorkouts = plannedDays.filter(
      (d) => d <= today && !trainedDays.has(d)
    ).length;

    return {
      completionRate,
      missedWorkouts,
    };
  }, [routine, sessions]);
}