import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workout, WorkoutSession } from "@/types/types";
import { applyLastSession } from "@/lib/applyLastSession";

interface WorkoutStore {
  workout: Workout | null;
  startedAt: Date | null;
  elapsedSeconds: number;
  currentExerciseId: string | null;

  initWorkout: (workoutId: string, templates: Workout[], sessions: WorkoutSession[]) => void;
  updateSet: (exerciseId: string, setId: string, field: "weight" | "reps" | "rir", value: number) => void;
  toggleSet: (exerciseId: string, setId: string) => void;
  editWorkout: (name: string, description: string) => void;
  addSet: (exerciseId: string) => void;
  deleteExercise: (exerciseId: string) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  addExercise: (exerciseId: string) => void;
  clearSession: () => void;
  incrementElapsedSeconds: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workout: null,
      startedAt: null,
      elapsedSeconds: 0,
      currentExerciseId: null,

      initWorkout: (workoutId, templates, sessions) => {
        const currentWorkout = get().workout;
        
        if (currentWorkout?.id === workoutId) return;

        const template = templates.find(t => t.id === workoutId);
        if (!template) return;

        const lastSession = sessions
          .filter(s => s.workout_id === workoutId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const initial = applyLastSession(template, lastSession);
        
        set({ workout: initial, startedAt: new Date(), elapsedSeconds: 0, currentExerciseId: initial.exercises[0]?.id ?? null });
      },

      updateSet: (exerciseId, setId, field, value) => {
        set((state) => {
          if (!state.workout) return state;
          
          const newExercises = state.workout.exercises.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
              ...ex,
              sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
            };
          });

          return { workout: { ...state.workout, exercises: newExercises } };
        });
      },

      toggleSet: (exerciseId, setId) => {
        set((state) => {
          if (!state.workout) return state;

          return {
            workout: {
              ...state.workout,
              exercises: state.workout.exercises.map(ex =>
                ex.id !== exerciseId
                  ? ex
                  : {
                      ...ex,
                      sets: ex.sets.map(s =>
                        s.id !== setId
                          ? s
                          : {
                              ...s,
                              isCompleted: !s.isCompleted,
                            }
                      ),
                    }
              ),
            },
          };
        });
      },

      editWorkout: (name, description) => {
        set((state) => {
          if (!state.workout) return state;
          return { workout: { ...state.workout, name, description } };
        });
      },

      addSet: (exerciseId) => {
        set((state) => {
          if (!state.workout) return state;
          const newExercises = state.workout.exercises.map(ex => {
            if (ex.id === exerciseId) {
              const newSet = {
                id: crypto.randomUUID(),
                exerciseInstanceId: ex.id,
                set: ex.sets.length + 1,
                weight: 0,
                reps: 0,
                rir: 0,
                isPR: false,
                isCompleted: false,
              };
              return { ...ex, sets: [...ex.sets, newSet] };
            }
            return ex;
          });

          return { workout: { ...state.workout, exercises: newExercises } };
        });
      },

      deleteExercise: (exerciseId) => {
        set((state) => {
          if (!state.workout) return state;
          const newExercises = state.workout.exercises.filter(ex => ex.id !== exerciseId);
          return { workout: { ...state.workout, exercises: newExercises } };
        });
      },

      deleteSet: (exerciseId, setId) => {
        set((state) => {
          if (!state.workout) return state;
          const newExercises = state.workout.exercises.map(ex => {
            if (ex.id === exerciseId) {
              const newSets = ex.sets.filter(s => s.id !== setId);
              return { ...ex, sets: newSets };
            }
            return ex;
          });

          return { workout: { ...state.workout, exercises: newExercises } };
        });
      },

      addExercise: (exerciseId) => {
        set((state) => {
          if (!state.workout) return state;
          const newExercise = {
            id: crypto.randomUUID(),
            exercise_id: exerciseId,
            name: "Ejercicio",
            sets: [],
          };
          return { workout: { ...state.workout, exercises: [...state.workout.exercises, newExercise] } };
        });
      },

      incrementElapsedSeconds: () => {
        set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
      },

      clearSession: () => set({ workout: null, startedAt: null, elapsedSeconds: 0, currentExerciseId: null }),
    }),
    {
      name: 'active_session', 
      partialize: (state) => ({
        workout: state.workout,
        startedAt: state.startedAt,
        elapsedSeconds: state.elapsedSeconds,
        currentExerciseId: state.currentExerciseId,
      }),
    }
  )
);