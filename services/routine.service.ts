import { supabase } from "@/lib/supabaseClient";
import { Routine } from "@/types/types";

export const routineService = {
    getAll: async (userId: string) => {
        const {data, error} = await supabase
            .from("routines")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }

        return data as Routine[];
    },
    getRoutineSingle: async (userId: string) => {
        const {data, error} = await supabase
            .from("routines")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();
        if (error) {
            throw new Error(error.message);
        }
        return data as Routine | null;
    },
    getById: async (routineId: string) => {
        const { data, error } = await supabase
        .from("routines")
        .select("*")
        .eq("id", routineId)
        .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Routine;
    },
    create: async (routineData: Omit<Routine, "id" | "created_at" | "updated_at">) => {
        const { data, error } = await supabase
        .from("routines")
        .insert(routineData)
        .select();

        if (error) throw new Error(error.message);

        return data[0] as Routine;
    },
    update: async (routineId: string, routineData: Partial<Routine>) => {
        const { data, error } = await supabase
            .from("routines")
            .update(routineData)
            .eq("id", routineId)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data as Routine;
    },
    delete: async (routineId: string) => {
        const { data, error } = await supabase
        .from("routines")
        .delete()
        .eq("id", routineId)
        .select();

        if (error) {
        throw new Error(error.message);
        }

        return data;
    }
};