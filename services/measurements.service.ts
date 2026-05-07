import { supabase } from "@/lib/supabaseClient";
import { BodyMeasurement } from "@/types/types";

export const measurementsService = {
    getAll: async (userId: string) => {
        const {data, error} = await supabase
            .from("measurements")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }

        return data as BodyMeasurement[];
    },
    create: async (measurement: Omit<BodyMeasurement, 'id'>) => {
        const { data, error } = await supabase
            .from("measurements")
            .insert(measurement)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data as BodyMeasurement;
    },
    update: async (measurement: BodyMeasurement) => {
        const { error } = await supabase
            .from("measurements")
            .update(measurement)
            .eq("id", measurement.id);

        if (error) throw new Error(error.message);
    }
};