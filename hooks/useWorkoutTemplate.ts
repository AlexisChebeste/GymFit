"use client";

import { Workout } from "@/types/types";
import { useEffect, useReducer, useState } from "react";
import { workoutReducer } from "./workoutReducer";
import { supabase } from "@/lib/supabaseClient";
import { workoutService } from "@/services/workout.service";

export function useWorkoutTemplate(workoutId: string) {

  const [isLoaded, setIsLoaded] = useState(false);

  const [state, dispatch] = useReducer(
    workoutReducer,
    null as unknown as Workout
  );

  useEffect(() => {
    if (!workoutId) return;

    const fetchWorkout = async () => {
      try {
        const data = await workoutService.getById(workoutId);

        dispatch({
          type: "INIT",
          payload: {
            ...data,
            exercises: data.exercises || [],
          },
        });
      } catch (err) {
        console.error("Error fetching workout:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const saveTemplate = async (updates?: {
    name?: string;
    description?: string;
  }) => {
    if (!state) return;

    try {
      const updated = await workoutService.update(workoutId, {
        name: updates?.name ?? state.name,
        description: updates?.description ?? state.description,
        exercises: state.exercises,
      });

      dispatch({
        type: "INIT",
        payload: updated,
      });

    } catch (err) {
      console.error("Error saving workout:", err);
    }
  };
  return {
    workout: state,
    dispatch,
    saveTemplate,
    isLoaded
  };
}