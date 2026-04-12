import { supabase } from "@/lib/supabaseClient";
import { Routine } from "@/types/types";
import { useEffect, useState } from "react";

export function useRoutines(userId: string) {
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRoutine = async () => {
      const {data, error } = await supabase
        .from("routines")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching routine:", error);
      } else {
        setRoutine(data || null);
      }
      setIsLoading(false);
    };

    fetchRoutine();
  }, [userId]);

  const createRoutine = async (days: { day: number; templateId: string }[]) => {
    const { data, error } = await supabase
      .from("routines")
      .insert({
        user_id: userId,
        days,
        name: "Mi rutina",
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setRoutine(data);
  };

 const updateRoutine = async (updatedRoutine: Routine) => {
    const { data, error } = await supabase
      .from("routines")
      .update({
        days: updatedRoutine.days,
        name: updatedRoutine.name,
      })
      .eq("id", updatedRoutine.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setRoutine(data);
  };

  return {
    routine,
    createRoutine,
    updateRoutine,
    isLoading
  };
}