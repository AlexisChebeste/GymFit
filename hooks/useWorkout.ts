"use client"

import { Workout, WorkoutSession } from "@/types/types";
import { useEffect, useReducer, useRef, useState } from "react";
import { workoutReducer } from "./workoutReducer";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { applyLastSession } from "@/lib/applyLastSession";
import { supabase } from "@/lib/supabaseClient";
import { useDebouncedEffect } from "./useDebouncedEffect";

type PersistedWorkout = Workout & {
  updatedAt: number;
  inProgress: boolean;
};

const workoutInitial: Workout = {
  id: '',
  name: '',
  user_id: '',
  description: '',
  exercises: [],
  created_at: new Date().toISOString(),
  color: 'blue'
};

export function useWorkout(workoutId: string, userId: string, sessions: WorkoutSession[]) {

  const [templates, setTemplates] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [state, dispatch] = useReducer(workoutReducer, workoutInitial);
  const initialized = useRef(false);

  const [persistedState, setPersistedState, isLocalLoaded] =
    useLocalStorage<PersistedWorkout | null>("active_session", null);

  useEffect(() => {
    if (!userId) return;

    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId);

      if (error) console.error(error);
      else setTemplates(data || []);

      setIsLoading(false);
    };

    fetchTemplates();
  }, [userId]);

  useEffect(() => {
    if (isLoading || !isLocalLoaded || initialized.current) return;

    const template = templates.find(t => t.id === workoutId);
    console.log("persistedState", persistedState);
    console.log("workoutId", workoutId);
    if (
      persistedState &&
      persistedState.id === workoutId &&
      persistedState.exercises?.length > 0
    ) {
      
      dispatch({ type: "INIT", payload: persistedState });
      initialized.current = true;
      return;
    }

    const lastSession = sessions
      .filter(s => s.workout_id === workoutId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const initial =
      template
        ? applyLastSession(template, lastSession)
        : workoutInitial;

    dispatch({ type: "INIT", payload: initial });

    initialized.current = true;
  }, [isLoading, isLocalLoaded, templates, workoutId, sessions, persistedState]);

  useEffect(() => {
    initialized.current = false;
  }, [workoutId]);


  useDebouncedEffect(() => {
    if (!isLocalLoaded) return;

    const payload = {
      ...state,
      updatedAt: Date.now(),
      inProgress: true
    };

    setPersistedState(payload);
  }, [state, isLocalLoaded], 800);

  return {
    workout: state,
    dispatch,
    isLoaded: !isLoading && isLocalLoaded,
    clearSession: () => setPersistedState(null)
  };
}