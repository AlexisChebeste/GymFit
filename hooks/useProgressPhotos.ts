"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type ProgressEntryUI = {
  id: string;
  date: string;
  weight?: number;
  note?: string;
  photos: {
    front?: string;
    side?: string;
    back?: string;
  };
};

export type PhotoType = "front" | "side" | "back";

type ProgressPhotoDB = {
  id: string;
  entry_id: string;
  type: PhotoType;
  path: string;
  user_id: string;
};

export function useProgressPhotos(userId: string | null) {
  const [entries, setEntries] = useState<ProgressEntryUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: entriesData, error: e1 } = await supabase
        .from("progress_entries")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true });

      if (e1) {
        setLoading(false);
        return;
      }

      const { data: photosData, error: e2 } = await supabase
        .from("progress_photos")
        .select("*")
        .in("entry_id", entriesData.map((e) => e.id));

      if (e2) {
        setLoading(false);
        return;
      }

      const mapped: ProgressEntryUI[] = await Promise.all(
        entriesData.map(async (entry: any) => {
          const photos = photosData.filter(
            (p: ProgressPhotoDB) => p.entry_id === entry.id
          );

          const photoMap: ProgressEntryUI["photos"] = {};

          for (const p of photos) {
            const { data } = await supabase.storage
              .from("progress-photos")
              .createSignedUrl(p.path, 60 * 60); // 1 hora

            if (data?.signedUrl && (p.type === "front" || p.type === "side" || p.type === "back")) {
              photoMap[p.type as PhotoType] = data.signedUrl;
            }
          }

          return {
            id: entry.id,
            date: entry.date,
            weight: entry.weight,
            note: entry.note,
            photos: photoMap,
          };
        })
      );

      setEntries(mapped);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const createEntry = async (weight?: number) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("progress_entries")
      .insert({
        user_id: userId,
        date: new Date().toISOString(),
        weight,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    setEntries((prev) => [
      ...prev,
      {
        id: data.id,
        date: data.date,
        weight: data.weight,
        photos: {},
      },
    ]);

    return data;
  };

  const uploadPhoto = async (
    file: File,
    entryId: string,
    type: PhotoType
  ) => {
    if (!userId) return null;

    const ext = file.name.split(".").pop();
    const path = `${userId}/${entryId}/${type}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("progress-photos")
      .upload(path, file);

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    const { error: dbError } = await supabase
      .from("progress_photos")
      .insert({
        entry_id: entryId,
        type,
        path, 
        user_id: userId,
      });

    if (dbError) {
      console.error(dbError);
      return null;
    }

    const { data } = await supabase.storage
      .from("progress-photos")
      .createSignedUrl(path, 60 * 60);

    const signedUrl = data?.signedUrl;

    if (signedUrl) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? {
                ...e,
                photos: {
                  ...e.photos,
                  [type]: signedUrl,
                },
              }
            : e
        )
      );
    }

    return signedUrl;
  };

  const getComparison = (index: number) => {
    if (index === 0) return null;

    const current = entries[index];
    const previous = entries[index - 1];

    return {
      current,
      previous,
      weightDiff: (current.weight ?? 0) - (previous.weight ?? 0),
    };
  };

  return {
    entries,
    loading,
    createEntry,
    uploadPhoto,
    getComparison,
  };
}