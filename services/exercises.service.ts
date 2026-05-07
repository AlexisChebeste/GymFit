import { supabase } from "@/lib/supabaseClient";
import { Exercise } from "@/types/types";

export const exerciseService = {
    getAll: async (userId: string) => {
        const {data, error} = await supabase
            .from("exercises")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }

        return data as Exercise[];
    },
    create: async (exercise: Omit<Exercise, 'id'>) => {
        const { data, error } = await supabase
            .from("exercises")
            .insert(exercise)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data as Exercise;
    },
    update: async (exercise: Exercise) => {
        const { error } = await supabase
            .from("exercises")
            .update(exercise)
            .eq("id", exercise.id);

        if (error) throw new Error(error.message);
    }
};