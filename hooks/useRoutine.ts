import { supabase } from "@/lib/supabaseClient";
import { routineService } from "@/services/routine.service";
import { Routine } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useRoutines(userId: string) {
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRoutine = async () => {
      try {
        const data = await routineService.getRoutineSingle(userId);
        setRoutine(data || null);
      } catch (err) {
        console.error("Error fetching routine:", err);
        toast.error("Error en cargar la rutina");
      } finally {
        setIsLoading(false);
      }
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