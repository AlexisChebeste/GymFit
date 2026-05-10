import { useMemo } from "react";
import { WorkoutSession } from "@/types/types";
import { generateExerciseInsight } from "@/lib/workout/workout.insights";
import { filterSessionsByRange, getBestSets, getExercisePR, getExerciseProgress, getExerciseSessions, getTotalVolume } from "@/lib/workout/workout.selectors";

export type Set = {
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

    const exerciseSessions = getExerciseSessions(sessions, exerciseId);

    const filtered = filterSessionsByRange(exerciseSessions, range);

    const bestSets = getBestSets(filtered.slice(-12));;

    const totalVolume = getTotalVolume(filtered);

    return {
      bestSets,
      pr: getExercisePR(filtered),
      totalVolume,
      frequency: filtered.length,
      progress: getExerciseProgress(filtered),
      insights: generateExerciseInsight(bestSets.map(s => s.score))
    };

  }, [sessions, exerciseId, range]);
}