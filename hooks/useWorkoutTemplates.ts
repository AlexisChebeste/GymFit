// hooks/useWorkoutTemplates.ts
import { useLocalStorage } from "@/lib/useLocalStorage";
import { Workout } from "@/types/types";
import { useEffect } from "react";

export function useWorkoutTemplates(userId: string) {
  const [templates, setTemplates, isLoaded] =
    useLocalStorage<Workout[]>("templates", []);

  useEffect(() => {
    if (!isLoaded) return;

    // Filtrar las plantillas para el usuario actual
    const userTemplates = templates.filter(t => t.userId === userId);
    setTemplates(userTemplates);
  }, [isLoaded, userId]);
    
  const createTemplate = () => {

    const idTemplate = crypto.randomUUID();

    const newTemplate: Workout = {
      id: idTemplate,
      userId: userId,
      name: `Rutina ${templates.length + 1}`,
      description: "Descripción",
      exercises: [],
      color: "#10B981",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev => [...prev, newTemplate]);

    return newTemplate.id; 
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const updateTemplate = (updated: Workout) => {
    setTemplates(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
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