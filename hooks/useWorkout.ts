"use client"

import { Workout, WorkoutSession } from "@/types/types";
import { useEffect, useReducer, useRef } from "react";
import { workoutReducer } from "./workoutReducer";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { applyLastSession } from "@/lib/applyLastSession";

const workoutInitial = { id: '', name: '', userId: '', description: '', exercises: [], createdAt: new Date().toISOString(), color: 'blue' };

export function useWorkout(workoutId: string, userId: string) {

  const [templates] = useLocalStorage<Workout[]>("templates", []);

  const [sessions] = useLocalStorage<WorkoutSession[]>("sessions", []);

  useEffect(() => {
    if (!userId) return;

    const userTemplates = templates.filter(t => t.userId === userId);

    if (userTemplates.length === 0) {
      const defaultTemplates = templates.filter(t => t.userId === "default");
      if (defaultTemplates.length > 0) {
        const newTemplates = [...templates, ...defaultTemplates.map(t => ({ ...t, userId }))];
        localStorage.setItem("templates", JSON.stringify(newTemplates));
      }
    }
  }, [userId, templates]);
  
  const [persistedState, setPersistedState, isLoaded] =
    useLocalStorage<Workout>("active_session", workoutInitial);

  const template = templates.find(t => t.id === workoutId);

  const existing = persistedState?.id === workoutId ? persistedState : null;

  const lastSession =
    sessions.length > 0 ? sessions[sessions.length - 1] : undefined;

  const initialState =
    existing ||
    (template
      ? applyLastSession(template, lastSession)
      : workoutInitial);

  const [state, dispatch] = useReducer(
    workoutReducer,
    initialState
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (isLoaded && !initialized.current) {
      dispatch({ type: "INIT", payload: initialState });
      initialized.current = true;
    }
  }, [isLoaded]);

    useEffect(() => {
      if (isLoaded) {
        setPersistedState(state);
      }
    }, [state, isLoaded]);

  return {
    workout: state,
    dispatch,
    isLoaded,
  };
}