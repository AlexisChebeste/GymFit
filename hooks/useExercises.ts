import { useLocalStorage } from "@/lib/useLocalStorage";
import { Exercise } from "@/types/types";


export function useExercises() {
  const [exercises, setExercises, isLoaded] =             useLocalStorage<Exercise[]>(
    "exercises",
    []
  );

  const createExercise = (name: string, type: string) => {
    const newEx: Exercise = {
      id: crypto.randomUUID(),
      name,
      type,
      userId: "local",
    };

    setExercises(prev => [...prev, newEx]);

    return newEx;
  };

  return {
    exercises,
    createExercise,
    isLoaded
  };
}