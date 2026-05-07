import { supabase } from "@/lib/supabaseClient";
import { WorkoutSession } from "@/types/types";

export const sessionService = {
    getAll: async (userId: string) => {
        const {data, error} = await supabase
            .from("workout_sessions")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }

        return data as WorkoutSession[];
    },
    create: async (session: Omit<WorkoutSession, 'id'>) => {
        const { data, error } = await supabase
            .from("workout_sessions")
            .insert([session])
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data as WorkoutSession;
    },
};