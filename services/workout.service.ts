import { supabase } from "@/lib/supabaseClient";
import { CreateWorkout, Workout } from "@/types/types";

export const workoutService = {
    getAll: async (userId: string) => {
        const {data, error} = await supabase
            .from("workouts")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },
    getById: async (workoutId: string) => {
        const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", workoutId)
        .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },
    create: async (workoutData: CreateWorkout) => {
        const { data, error } = await supabase
        .from("workouts")
        .insert([workoutData])
        .select();

        if (error) throw new Error(error.message);

        return data[0] as Workout;
    },
    update: async (workoutId: string, workoutData: Partial<Workout>) => {
        const { data, error } = await supabase
            .from("workouts")
            .update(workoutData)
            .eq("id", workoutId)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data as Workout;
    },
    delete: async (workoutId: string) => {
        const { data, error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId)
        .select();

        if (error) {
        throw new Error(error.message);
        }

        return data;
    }
};