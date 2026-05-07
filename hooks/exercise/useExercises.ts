"use client";

import { exerciseService } from "@/services/exercises.service";
import { Exercise } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useExercises(userId: string) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchExercises = async () => {
      try{
        const data = await exerciseService.getAll(userId);

        const mapped = data.map((ex) => ({
          id: ex.id,
          name: ex.name,
          type: ex.type,
          user_id: ex.user_id,
        }));

        setExercises(mapped);
      }catch(error){
        toast.error("Error fetching exercises");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [userId]);

  const createExercise = async (name: string, type: string) => {
    
    try{
      const data = await exerciseService.create({
        name,
        type,
        user_id: userId,
      });

      const newEx: Exercise = {
        id: data.id,
        name: data.name,
        type: data.type,
        user_id: data.user_id,
      };

      setExercises((prev) => [...prev, newEx]);
      
      return newEx;
    }   catch(error){
      toast.error("Error creating exercise");
      return;
    }
  };

  return {
    exercises,
    createExercise,
    isLoading,
  };
}