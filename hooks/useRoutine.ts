import { useLocalStorage } from "@/lib/useLocalStorage";
import { Routine } from "@/types/types";

export function useRoutines() {
  const [routine, setRoutine] = useLocalStorage<Routine>("routine", {
    id: "",
    name: "",
    userId: "",
    days: [],
    createdAt: "",
  });

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