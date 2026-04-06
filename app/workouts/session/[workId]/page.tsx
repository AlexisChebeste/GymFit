"use client"

import ExerciseCard from "@/components/cards/ExerciseCard";
import { useWorkout } from "@/hooks/useWorkout";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type { WorkoutSession } from "@/types/types";
import { useParams, useRouter } from "next/navigation";

export default function WorkoutSession() {
  const params = useParams();
  const workoutId = params.workId as string;
  const router = useRouter();

  if (!workoutId) {
    return <div className="flex items-center justify-center h-screen">ID de rutina no proporcionado.</div>;
  }

  const [sessions, setSessions, isSessionsLoaded] = useLocalStorage<WorkoutSession[]>(
    "sessions",
    []
  );
  
  const {
    workout,
    dispatch,
    isLoaded,
  } = useWorkout(workoutId);

  if (!isSessionsLoaded || !isLoaded) return null; // o un loader

  const handleFinishSession = () => {
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      workoutId: workout.id,
      date: new Date().toISOString(),
      exercises: workout.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map(s => ({
          weight: s.weight,
          reps: s.reps,
          rir: s.rir,
        }))
      }))
    };

    setSessions(prev => [...prev, session]);

    
    localStorage.removeItem("active_session");
    
    router.push("/workouts");
  };
  
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
      <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural overflow-y-auto max-h-[calc(100dvh-6rem)]">
        <p className="uppercase text-sm text-primary leading-5 tracking-widest">Sesión Actual</p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full pb-2">
          
          <div className="flex flex-col gap-2 ">
            
            <h1 className="text-4xl font-bold">{workout.name}</h1>  
            <p className="text-sm text-secondary">{workout.description}</p>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {workout.exercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              mode="session"
              setActions={{
                update: (setId, field, value) =>
                  dispatch({ type: "UPDATE_SET", payload: { exerciseInstanceId: exercise.id, setId, field, value } }),
                toggle: (exerciseInstanceId, setId) =>
                  dispatch({ type: "TOGGLE_SET", payload: { exerciseInstanceId, setId } }),
              }}
              sessions={sessions}
            />
          ))}
        </section>

        <footer className="w-full py-8 mt-4 border-t border-zinc-800">
          <button 
            onClick={handleFinishSession}
            className="w-full bg-primary/90 text-natural hover:bg-primary/80  font-black py-4 rounded-2xl shadow-neon-glow transition-transform active:scale-95 cursor-pointer"
          >
            FINALIZAR Y GUARDAR SESIÓN
          </button>
        </footer>
        

      </main>
    </div>
  );
}