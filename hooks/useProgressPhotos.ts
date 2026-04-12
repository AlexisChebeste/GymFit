"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProgressPhoto } from "@/types/types";

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
        console.error(e1);
        setLoading(false);
        return;
      }

      const { data: photosData, error: e2 } = await supabase
        .from("progress_photos")
        .select("*");

      if (e2) {
        console.error(e2);
        setLoading(false);
        return;
      }

      const mapped: ProgressEntryUI[] = entriesData.map((entry: any) => {
        const photos : ProgressPhoto[] = photosData.filter((p : ProgressPhoto) => p.entry_id === entry.id);

        const photoMap: ProgressEntryUI["photos"] = {};

        photos.forEach((p) => {
          photoMap[p.type as PhotoType] = p.url;
        });

        return {
          id: entry.id,
          date: entry.date,
          weight: entry.weight,
          note: entry.note,
          photos: photoMap,
        };
      });

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

    const { data } = supabase.storage
      .from("progress-photos")
      .getPublicUrl(path);

    const url = data.publicUrl;

    const { error: dbError } = await supabase
      .from("progress_photos")
      .insert({
        entry_id: entryId,
        type,
        url,
      });

    if (dbError) {
      console.error(dbError);
      return null;
    }

    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              photos: {
                ...e.photos,
                [type]: url,
              },
            }
          : e
      )
    );

    return url;
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