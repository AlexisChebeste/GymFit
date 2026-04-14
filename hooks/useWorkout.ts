"use client"

import { Workout, WorkoutSession } from "@/types/types";
import { useEffect, useReducer, useRef, useState } from "react";
import { workoutReducer } from "./workoutReducer";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { applyLastSession } from "@/lib/applyLastSession";
import { supabase } from "@/lib/supabaseClient";

const workoutInitial = { id: '', name: '', user_id: '', description: '', exercises: [], created_at: new Date().toISOString(), color: 'blue' };

export function useWorkout(workoutId: string, userId: string, sessions: WorkoutSession[]) {

  const [templates, setTemplates] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [state, dispatch] = useReducer(workoutReducer, workoutInitial);
  const initialized = useRef(false);

  useEffect(() => {
    if (!userId) return;

    const fetchTemplates = async () => {
      const {data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)

      if (error) {
        console.error("Error fetching routine:", error);
      } else {
        setTemplates(data || null);
      }
      setIsLoading(false);
    };

    fetchTemplates();
  }, [userId]);
  
  const [persistedState, setPersistedState, isLocalLoaded] = useLocalStorage<Workout>("active_session", workoutInitial);

  // 🔹 inicialización REAL
  useEffect(() => {
    if (isLoading || !isLocalLoaded || initialized.current) return;

    const template = templates.find(t => t.id === workoutId);

    const existing =
      persistedState?.id === workoutId ? persistedState : null;

    const lastSession =
      sessions.length > 0 ? sessions[sessions.length - 1] : undefined;

    const initial =
      existing ||
      (template
        ? applyLastSession(template, lastSession)
        : workoutInitial);

    dispatch({ type: "INIT", payload: initial });

    initialized.current = true;
  }, [isLoading, isLocalLoaded, templates, workoutId, sessions]);

  // 🔹 persistir en localStorage
  useEffect(() => {
    if (!isLocalLoaded) return;
    setPersistedState(state);
  }, [state, isLocalLoaded]);

  return {
    workout: state,
    dispatch,
    isLoaded: !isLoading && isLocalLoaded,
  };
}