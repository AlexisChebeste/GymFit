import { supabase } from "@/lib/supabaseClient";
import { workoutService } from "@/services/workout.service";
import { CreateWorkout, Workout } from "@/types/types";
import { useEffect, useState } from "react";

export function useWorkoutTemplates(userId: string) {
  const [templates, setTemplates] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if(!userId) return;

    const fetchTemplates = async () => {
      try {
        const data = await workoutService.getAll(userId);
        setTemplates(data || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchTemplates();
  }, [userId]);
    
  const createTemplate = async () => {
    const newTemplate: CreateWorkout = {
      user_id: userId,
      name: `Rutina ${templates.length + 1}`,
      description: "Descripción",
      exercises: [],
      color: "#10B981",
    };

    try {
      const data : Workout = await workoutService.create(newTemplate);
      
      setTemplates((prev) => [...prev, data]);
      
      return data.id;
    }catch (error) {
      console.error(error);
      return;
    }


  };

  const deleteTemplate = async (id: string) => {
    try {
      await workoutService.delete(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return {
    templates,
    createTemplate,
    deleteTemplate,
    isLoaded,
  };
}