import { useMemo } from "react";
import { WorkoutSession } from "@/types/types";

type Set = {
  weight: number;
  reps: number;
  rir: number;
};

export type BestSet = {
  date: string;
  rawDate: string;
  weight: number;
  reps: number;
  rir?: number;
  score: number;
};

export type ExerciseStats = {
  bestSets: BestSet[];
  pr: Set | null;
  totalVolume: number;
  frequency: number;
  progress: number | null;
  insights: string;
};

export function useExerciseStats(
  sessions: WorkoutSession[],
  exerciseId: string,
  range: "30D" | "3M" | "6M" | "ALL"
) {
  return useMemo(() => {

    const now = new Date();

    const rangeDays =
      range === "30D" ? 30 :
      range === "3M" ? 90 :
      range === "6M" ? 180 :
      Infinity;

    const getScore = (s: Set) =>
      s.weight * (1 + (s.reps + s.rir) / 30);

    const formatDate = (date: string) =>
      new Date(date).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short"
      });

    const exerciseSessions = sessions
      .map(session => {
        const ex = session.exercises.find(e => e.exercise_id === exerciseId);
        if (!ex) return null;

        const diff =
          (now.getTime() - new Date(session.date).getTime()) /
          (1000 * 60 * 60 * 24);

        return {
          date: session.date,
          sets: ex.sets,
          inRange: diff <= rangeDays
        };
      })
      .filter(Boolean) as {
        date: string;
        sets: Set[];
        inRange: boolean;
      }[];

    const allSessions = exerciseSessions;
    const filtered = exerciseSessions.filter(s => s.inRange);

    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const lastSessions = sorted.slice(-12);

    const bestSets = lastSessions.map(session => {
      const best = session.sets.reduce((a, b) =>
        getScore(a) > getScore(b) ? a : b
      );

      return {
        rawDate: session.date,
        date: formatDate(session.date),
        ...best,
        score: getScore(best)
      };
    });

    let pr: Set | null = null;

    allSessions.forEach(session => {
      session.sets.forEach(set => {
        if (
          !pr ||
          set.weight > pr.weight ||
          (set.weight === pr.weight && set.reps > pr.reps)
        ) {
          pr = set;
        }
      });
    });

    const totalVolume = filtered.reduce((acc, s) => {
      return acc + s.sets.reduce((sum, set) =>
        sum + set.weight * set.reps, 0);
    }, 0);

    const frequency = filtered.length;

    let progress: number | null = null;

    if (sorted.length >= 4) {
      const first = sorted.slice(0, 3);
      const last = sorted.slice(-3);

      const avg = (arr: typeof sorted) =>
        arr.reduce((acc, s) =>
          acc + s.sets.reduce((sum, set) =>
            sum + set.weight * set.reps, 0), 0
        ) / arr.length;

      const prev = avg(first);
      const curr = avg(last);

      if (prev !== 0) {
        progress = ((curr - prev) / prev) * 100;
      }
    }

    let insights = "Seguí entrenando para obtener más datos.";

    if (bestSets.length >= 3) {
      const scores = bestSets.map(s => s.score);
      const last = scores.at(-1)!;
      const prev = scores.at(-2)!;

      const plateau = scores
        .slice(-4)
        .every(s => Math.abs(s - last) < last * 0.02);

      if (plateau) {
        insights = "Estancamiento detectado. Probá cambiar volumen o intensidad.";
      } else if (last > prev) {
        insights = "Progreso positivo. Estás levantando más que antes.";
      } else if (last < prev * 0.9) {
        insights = "Fatiga detectada. Considerá descanso o deload.";
      }
    }

    return {
      bestSets,
      pr,
      totalVolume,
      frequency,
      progress,
      insights
    };

  }, [sessions, exerciseId, range]);
}