import { workoutService } from "@/services/workout.service";
import { Workout } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useWorkoutTemplates(userId: string, workoutId?: string) {
  const [templates, setTemplates] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if(!userId) return;

    const fetchTemplates = async () => {
      try {
        const data = await workoutService.getAll(userId);
        console.log("Fetched templates:", data);
        setTemplates(data || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
        toast.error("Error al cargar las plantillas de entrenamiento.");
      } finally {
        setIsLoaded(true);
      }
    };

    fetchTemplates();
  }, [userId]);
    
  const createTemplate = async () => {

    try {
      const data : Workout = await workoutService.create(userId, templates.length);
      
      setTemplates((prev) => [...prev, data]);
      
      return data.id;
    }catch (error) {
      toast.error("Error al crear la plantilla de entrenamiento.");
    }

  };

  const deleteTemplate = async (id: string) => {
    try {
      await workoutService.delete(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast.error("Error al eliminar la plantilla de entrenamiento.");
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Workout>) => {
    const updated = await workoutService.update(id, updates);

    setTemplates(prev =>
      prev.map(t => (t.id === id ? updated : t))
    );
  };

  return {
    templates,
    createTemplate,
    deleteTemplate,
    updateTemplate,
    isLoaded,
  };
}