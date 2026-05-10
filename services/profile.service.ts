import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "@/types/types";

export const profileService = {
    getById: async (userId: string) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as UserProfile;
    },
    update: async (userId: string, userData: Partial<UserProfile>) => {
        const { data, error } = await supabase
            .from("profiles")
            .update(userData)
            .eq("id", userId)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data as UserProfile;
    },
    uploadAvatar: async (userId: string, file: File) => {
        const fileExt = file.name.split(".").pop();
        const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
            });

        if (uploadError) {
            throw new Error(uploadError.message);
        }

        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};