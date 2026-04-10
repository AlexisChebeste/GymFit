import { useLocalStorage } from "@/lib/useLocalStorage";
import { Routine } from "@/types/types";
import { useEffect } from "react";

export function useRoutines(userId: string) {
  const [routine, setRoutine, isLoading] = useLocalStorage<Routine>("routine", {
    id: "",
    name: "",
    userId: "",
    days: [],
    createdAt: "",
  });

  useEffect(() => {
    if (!isLoading && routine.userId !== userId) {

    const existingRoutine = routine.id ? routine : null;

    if (existingRoutine) {
      setRoutine(existingRoutine);
    } else {
      setRoutine({
        id: "",
        name: "",
        userId: userId,
        days: [],
        createdAt: new Date().toISOString(),
      });
    }
    }
  }, [isLoading, userId]);

  const createRoutine = (routinePlan: Routine) => {
    setRoutine(routinePlan);
  };

  const updateRoutine = (updatedRoutine: Routine) => {
    setRoutine(updatedRoutine);
  }

  return {
    routine,
    createRoutine,
    updateRoutine
  };
}