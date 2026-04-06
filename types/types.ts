
export type Workout = {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
    description: string;
    color: string;
    exercises: ExerciseInstance[];
};

export type Exercise = {
    id: string;
    name: string;
    type: string;
    userId: string;
};

export type ExerciseInstance = {
    id: string;
    exerciseId: string;
    sets: Set[];
};

export type Set = {
    id: string;
    exerciseInstanceId: string;
    set: number;
    weight: number;
    reps: number;
    rir: number;
    isPR: boolean;
    isCompleted: boolean;
};

export type WorkoutSession = {
  id: string;
  workoutId: string;
  date: string;
  exercises: {
    exerciseId: string;
    sets: {
      weight: number;
      reps: number;
      rir: number;
    }[];
  }[];
};

export type Routine = {
  id: string;
  userId: string;
  name: string; 
  days: RoutineDay[];
  createdAt: string;
  updatedAt?: string;
};

export type RoutineDay = {
  day: number; 
  templateId: string;
};