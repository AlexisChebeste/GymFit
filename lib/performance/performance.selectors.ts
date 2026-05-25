import { WorkoutSession } from "@/types/types";

export function getExercisePerformanceMap(
  sessions: WorkoutSession[]
) {
  const map = new Map();

  sessions.forEach(session => {
    session.exercises.forEach(ex => {
      const current = map.get(ex.exercise_id);

      const bestSet = ex.sets.reduce((best, set) => {
        const currentScore =
          set.weight * (1 + set.reps / 30);

        const bestScore =
          best.weight * (1 + best.reps / 30);

        return currentScore > bestScore
          ? set
          : best;
      });

      if (!current) {
        map.set(ex.exercise_id, {
          last: bestSet,
          pr: bestSet
        });

        return;
      }

      const prScore =
        current.pr.weight *
        (1 + current.pr.reps / 30);

      const newScore =
        bestSet.weight *
        (1 + bestSet.reps / 30);

      map.set(ex.exercise_id, {
        last: bestSet,
        pr:
          newScore > prScore
            ? bestSet
            : current.pr
      });
    });
  });

  return map;
}