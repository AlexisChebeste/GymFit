import { supabase } from "@/lib/supabaseClient";

export const performanceService = {
  async getWorkoutPerformance(
    userId: string,
    workoutId: string
  ) {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("workout_id", workoutId)
      .order("date", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};