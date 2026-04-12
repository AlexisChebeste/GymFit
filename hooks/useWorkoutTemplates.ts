import { supabase } from "@/lib/supabaseClient";
import { Workout } from "@/types/types";
import { useEffect, useState } from "react";

export function useWorkoutTemplates(userId: string) {
  const [templates, setTemplates] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if(!userId) return;

    const fetchTemplates = async () => {
      const {data, error} = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching templates:", error);
      } else {
        setTemplates(data as Workout[]);
      }
      setIsLoaded(true);
    };

    fetchTemplates();

  }, [userId]);
    
  const createTemplate = async () => {
    const newTemplate = {
      user_id: userId,
      name: `Rutina ${templates.length + 1}`,
      description: "Descripción",
      exercises: [],
      color: "#10B981",
    };

    const { data, error } = await supabase
      .from("workouts")
      .insert(newTemplate)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setTemplates((prev) => [...prev, data]);

    return data.id;
  };

 const deleteTemplate = async (id: string) => {
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTemplate = async (updated: Workout) => {
    const { error } = await supabase
      .from("workouts")
      .update({
        name: updated.name,
        description: updated.description,
        exercises: updated.exercises,
        color: updated.color,
      })
      .eq("id", updated.id);

    if (error) {
      console.error(error);
      return;
    }

    setTemplates((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
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