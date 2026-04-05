"use client";

import { Workout } from "@/types/types";
import { useEffect, useReducer } from "react";
import { workoutReducer } from "./workoutReducer";
import { useLocalStorage } from "@/lib/useLocalStorage";

export function useWorkoutTemplate(workoutId: string) {

  const [templates, setTemplates, isLoaded] = useLocalStorage<Workout[]>(
    "templates",
    []
  );

  // buscar si ya existe template
  const existing = templates.find(t => t.id === workoutId);

  const [state, dispatch] = useReducer(
    workoutReducer,
    existing || { id: workoutId, name: '', userId: '', description: '', exercises: [], createdAt: new Date().toISOString(), color: 'blue' }
  );

  // guardar cambios en templates
  const saveTemplate = (override?: Partial<Workout>) => {
    const finalState = { ...state, ...override };

    setTemplates(prev => {
      const exists = prev.find(t => t.id === finalState.id);

      if (exists) {
        return prev.map(t =>
          t.id === finalState.id ? finalState : t
        );
      }

      return [...prev, finalState];
    });
  };

  useEffect(() => {
    if (existing) {
      dispatch({ type: "RESET", payload: existing });
    }
  }, [existing]);


  return {
    workout: state,
    dispatch,
    saveTemplate,
    isLoaded
  };
}