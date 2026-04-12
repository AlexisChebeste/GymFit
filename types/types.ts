
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
  userId: string;
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

export type BodyMeasurement = {
  id: string;
  userId: string;
  date: string;

  weight: number;
  bodyFat: number;

  chest: number;
  waist: number;
  arm: number;
  leg: number;

  createdAt: string;
  updatedAt?: string;
};

export type ProgressEntry = {
  id: string;
  userId: string;
  date: string;

  weight?: number;
  note?: string;
  muscleMass?: number;
  bodyFat?: number;

  createdAt: string;
};

export type ProgressPhoto = {
  id: string;
  entry_id: string;
  url: string;
  type: "front" | "side" | "back";
  createdAt: string;
};

export type UserProfile = {
  id: string;
  email: string;
  avatarUrl?: string;
  name: string;
  age: number;
  height: number;
  weight_goal: number;
  goal_type: GoalOption;
  created_at: string;
  updated_at?: string;
};

export type GoalOption = "lose" | "maintain" | "gain";