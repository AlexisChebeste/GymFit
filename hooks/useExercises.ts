"use client";

import { supabase } from "@/lib/supabaseClient";
import { Exercise } from "@/types/types";
import { useEffect, useState } from "react";

export function useExercises(userId: string) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching exercises:", error);
      } else {
        const mapped = data.map((ex) => ({
          id: ex.id,
          name: ex.name,
          type: ex.type,
          user_id: ex.user_id,
        }));

        setExercises(mapped);
      }

      setIsLoading(false);
    };

    fetchExercises();
  }, [userId]);

  const createExercise = async (name: string, type: string) => {
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        name,
        type,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating exercise:", error);
      return null;
    }

    const newEx: Exercise = {
      id: data.id,
      name: data.name,
      type: data.type,
      user_id: data.user_id,
    };

    setExercises((prev) => [...prev, newEx]);

    return newEx;
  };

  return {
    exercises,
    createExercise,
    isLoading,
  };
}