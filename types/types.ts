
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

export type ExerciseInstance = {
    id: string;
    workoutId: string;
    name: string;
    type: string;
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
    id: string;
    name: string;
    sets: {
      weight: number;
      reps: number;
    }[];
  }[];
};