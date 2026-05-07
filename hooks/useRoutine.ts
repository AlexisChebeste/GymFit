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
    try{
      const newRoutine = await routineService.create({
        user_id: userId,
        name: "Mi Rutina",
        days
      });
      setRoutine(newRoutine);
    } catch (err) {
      toast.error("Error al crear la rutina");
    }
  };

 const updateRoutine = async (updatedRoutine: Routine) => {
    try {
      const updated = await routineService.update(updatedRoutine.id, updatedRoutine);
      setRoutine(updated);
    } catch (err) {
      toast.error("Error al actualizar la rutina");
    }
  };

  return {
    routine,
    createRoutine,
    updateRoutine,
    isLoading
  };
}