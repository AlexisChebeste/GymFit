import { Workout, WorkoutSession } from "@/types/types";

export function applyLastSession(
  template: Workout,
  lastSession?: WorkoutSession
): Workout {
  if (!lastSession) return template;

  return {
    ...template,
    exercises: template.exercises.map((ex) => {
      const lastEx = lastSession.exercises.find(
        (e) => e.exerciseId === ex.exerciseId
      );

      if (!lastEx) return ex;

      return {
        ...ex,
        sets: ex.sets.map((set, index) => {
          const lastSet = lastEx.sets[index];

          if (!lastSet) return set;

          return {
            ...set,
            weight: lastSet.weight,
            reps: lastSet.reps,
            rir: lastSet.rir ?? 0, // 👈 importante ahora
            isCompleted: false,
            isPR: false,
          };
        }),
      };
    }),
  };
}