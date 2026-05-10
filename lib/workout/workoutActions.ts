import { Workout } from "@/types/types";

export const workoutActions = {

    init: (workout: Workout) => ({
        type: "INIT" as const,
        payload: workout,
    }),

    addSet: (exerciseInstanceId: string) => ({
        type: "ADD_SET" as const,
        payload: { exerciseInstanceId },
    }),

    updateSet: (exerciseInstanceId: string, setId: string, field: 'weight' | 'reps' | 'rir', value: number) => ({
        type: "UPDATE_SET" as const,
        payload: { exerciseInstanceId, setId, field, value },
    }),

    deleteSet: (
        exerciseInstanceId: string,
        setId: string
    ) => ({
        type: "DELETE_SET" as const,
        payload: { exerciseInstanceId, setId },
    }),

    toggleSet: (
        exerciseInstanceId: string,
        setId: string
    ) => ({
        type: "TOGGLE_SET" as const,
        payload: { exerciseInstanceId, setId },
    }),

    addExercise: (exerciseId: string) => ({
        type: "ADD_EXERCISE" as const,
        payload: { exerciseId },
    }),

    deleteExercise: (exerciseId: string) => ({
        type: "DELETE_EXERCISE" as const,
        payload: { exerciseId },
    }),

    resetWorkout: (workout: Workout) => ({
        type: "RESET" as const,
        payload: workout,
    }),

    editWorkout: (name: string, description: string) => ({
        type: "EDIT_WORKOUT" as const,
        payload: { name, description },
    }),


};