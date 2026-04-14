
export type Workout = {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at?: string;
    description: string;
    color: string;
    exercises: ExerciseInstance[];
};

export type Exercise = {
    id: string;
    name: string;
    type: string;
    user_id: string;
};

export type ExerciseInstance = {
    id: string;
    exercise_id: string;
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
  workout_id: string;
  user_id: string;
  date: string;
  exercises: {
    exercise_id: string;
    sets: {
      weight: number;
      reps: number;
      rir: number;
    }[];
  }[];
};

export type Routine = {
  id: string;
  user_id: string;
  name: string; 
  days: RoutineDay[];
  created_at: string;
  updated_at?: string;
};

export type RoutineDay = {
  day: number; 
  templateId: string;
};

export type BodyMeasurement = {
  id: string;
  user_id: string;
  date: string;

  weight: number;
  body_fat: number;

  chest: number;
  waist: number;
  left_arm: number;
  right_arm: number;
  left_leg: number;
  right_leg: number;

  created_at: string;
  updated_at?: string;
};

export type ProgressEntry = {
  id: string;
  user_id: string;
  date: string;

  weight?: number;
  note?: string;
  muscleMass?: number;
  bodyFat?: number;

  created_at: string;
};

export type ProgressPhoto = {
  id: string;
  entry_id: string;
  url: string;
  type: "front" | "side" | "back";
  created_at: string;
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