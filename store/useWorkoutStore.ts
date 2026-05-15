import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workout, WorkoutSession } from "@/types/types";
import { applyLastSession } from "@/lib/applyLastSession";

interface WorkoutStore {
  workout: Workout | null;
  isLoaded: boolean;
  
  initWorkout: (workoutId: string, templates: Workout[], sessions: WorkoutSession[]) => void;
  updateSet: (exerciseId: string, setId: string, field: string, value: any) => void;
  toggleSet: (exerciseId: string, setId: string) => void;
  editWorkout: (name: string, description: string) => void;
  addSet: (exerciseId: string) => void;
  deleteExercise: (exerciseId: string) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  addExercise: (exerciseId: string) => void;
  clearSession: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workout: null,
      isLoaded: false,

      initWorkout: (workoutId, templates, sessions) => {
        const currentWorkout = get().workout;
        
        if (currentWorkout?.id === workoutId) return;

        const template = templates.find(t => t.id === workoutId);
        if (!template) return;

        const lastSession = sessions
          .filter(s => s.workout_id === workoutId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const initial = applyLastSession(template, lastSession);
        
        set({ workout: initial, isLoaded: true });
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
          
          state.workout.exercises.forEach(ex => {
            if (ex.id === exerciseId) {
              ex.sets.forEach(s => {
                if (s.id === setId) {
                  s.isCompleted = !s.isCompleted;
                }
              });
            }
          });

          return { workout: { ...state.workout } };
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
                id: `temp-${Date.now()}`,
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
            id: `temp-ex-${Date.now()}`,
            exercise_id: exerciseId,
            name: "Ejercicio",
            sets: [],
          };
          return { workout: { ...state.workout, exercises: [...state.workout.exercises, newExercise] } };
        });
      },

      clearSession: () => set({ workout: null, isLoaded: false }),
    }),
    {
      name: 'active_session', 
    }
  )
);