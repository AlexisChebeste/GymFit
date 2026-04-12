"use client";

import { Workout } from "@/types/types";
import { useEffect, useReducer, useState } from "react";
import { workoutReducer } from "./workoutReducer";
import { supabase } from "@/lib/supabaseClient";

export function useWorkoutTemplate(workoutId: string) {

  const [isLoaded, setIsLoaded] = useState(false);

  const [state, dispatch] = useReducer(
    workoutReducer,
    null as unknown as Workout
  );

  useEffect(() => {
  if (!workoutId) return;

  const fetchWorkout = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", workoutId)
      .single();

    if (error) {
      console.error("Error fetching workout:", error);
    } else {
      const formatted: Workout = {
        ...data,
        exercises: data.exercises || [],
      };

      dispatch({
        type: "INIT",
        payload: formatted,
      });
    }

    setIsLoaded(true);
  };

  fetchWorkout();
}, [workoutId]);

const saveTemplate = async (updates?: {
    name: string;
    description: string;
  }) => {
    if (!state) return;

    const updatedWorkout = {
      ...state,
      ...updates,
    };

    const { error } = await supabase
      .from("workouts")
      .update({
        name: updatedWorkout.name,
        description: updatedWorkout.description,
        exercises: updatedWorkout.exercises,
      })
      .eq("id", workoutId);

    if (error) {
      console.error("Error saving workout:", error);
    } else {
      dispatch({
        type: "EDIT_WORKOUT",
        payload: {
          name: updatedWorkout.name,
          description: updatedWorkout.description
        }
      });
    }
  };

  return {
    workout: state,
    dispatch,
    saveTemplate,
    isLoaded
  };
}