import { supabase } from "@/lib/supabaseClient";

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/avatar.${fileExt}`;

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

  console.log("URL del avatar subido:", data.publicUrl);

  return data.publicUrl;
}