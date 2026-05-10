import { Workout } from "@/types/types";

export function addSet(
  workout: Workout,
  exerciseInstanceId: string
): Workout {
  return {
    ...workout,
    exercises: workout.exercises.map(ex =>
      ex.id === exerciseInstanceId
        ? {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: crypto.randomUUID(),
                exerciseInstanceId: ex.id,
                set: ex.sets.length + 1,
                weight: 0,
                reps: 0,
                rir: 0,
                isPR: false,
                isCompleted: false,
              },
            ],
          }
        : ex
    ),
  };
}

export function updateSet(
    workout: Workout,
    exerciseInstanceId: string,
    setId: string,
    field: "weight" | "reps" | "rir",
    value: number
): Workout {
  return {
    ...workout,
    exercises: workout.exercises.map(ex =>
        ex.id === exerciseInstanceId
        ? {
            ...ex,
            sets: ex.sets.map(s =>
                s.id === setId
                ? { ...s, [field]: value }
                : s
            )
            }
        : ex
    )
    };
}

export function toggleSetCompletion(
    workout: Workout,
    exerciseInstanceId: string,
    setId: string
): Workout {
  return {
    ...workout,
    exercises: workout.exercises.map(ex =>
      ex.id === exerciseInstanceId
        ? {
            ...ex,
            sets: ex.sets.map(s =>
              s.id === setId
                ? { ...s, isCompleted: !s.isCompleted }
                : s
            )
          }
        : ex
    )
  };
}

export function deleteSet(
    workout: Workout,
    exerciseInstanceId: string,
    setId: string
): Workout {
  return {
    ...workout,
    exercises: workout.exercises.map(ex =>
      ex.id === exerciseInstanceId
        ? {
            ...ex,
            sets: ex.sets 
                .filter(s => s.id !== setId)
                .map((s, i) => ({ ...s, set: i + 1 })) 
          }
        : ex
    )
  };
}

export function deleteExercise(
    workout: Workout,
    exerciseInstanceId: string
): Workout {
  return {
    ...workout,
    exercises: workout.exercises.filter(ex => ex.id !== exerciseInstanceId)
  };
}

export function addExercise(
    workout: Workout,
    exerciseId: string
): Workout {
  const instanceId = crypto.randomUUID();   
    return {
        ...workout,
        exercises: [
            ...workout.exercises,
            {
                id: instanceId,
                exercise_id: exerciseId,
                sets: [
                    {
                        id: crypto.randomUUID(),
                        exerciseInstanceId: instanceId,
                        set: 1,
                        weight: 0,
                        reps: 0,
                        rir: 0,
                        isPR: false,
                        isCompleted: false,
                    }
                ]
            }
        ]
    };
}