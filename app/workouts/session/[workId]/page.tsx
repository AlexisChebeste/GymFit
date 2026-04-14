"use client"

import ExerciseCard from "@/components/cards/ExerciseCard";
import { useExercises } from "@/hooks/useExercises";
import useSessions from "@/hooks/useSessions";
import { useUser } from "@/hooks/useUser";
import { useWorkout } from "@/hooks/useWorkout";
import type { WorkoutSession } from "@/types/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function WorkoutSession() {
  const params = useParams();
  const {user} = useUser();
  const workoutId = params.workId as string;
  const router = useRouter();

  if (!workoutId) {
    return <div className="flex items-center justify-center h-screen">ID de rutina no proporcionado.</div>;
  }

  const { sessions, setSessions, isSessionsLoaded } = useSessions(user?.id ?? "");
  const { exercises } = useExercises(user?.id ?? "");
  const {
    workout,
    dispatch,
    isLoaded,
  } = useWorkout(workoutId, user?.id ?? "", sessions);

  if (!isSessionsLoaded || !isLoaded) return null; // o un loader

  const handleFinishSession = () => {
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      workout_id: workout.id,
      date: new Date().toISOString(),
      user_id: user?.id ?? "",
      exercises: workout.exercises.map(ex => ({
        exercise_id: ex.exercise_id,
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
  
  if (!workout || workout.exercises.length === 0) {
    return <div className="flex flex-col gap-6 items-center justify-center h-screen">
      Rutina no encontrada o sin ejercicios.
      <Link 
        href="/workouts"
        className="ml-4 bg-primary/90 text-natural hover:bg-primary/80  font-black py-2 px-4 rounded-2xl shadow-neon-glow transition-transform active:scale-95 cursor-pointer"
      >
        Volver a Rutinas
      </Link>
    </div>;
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[90vh] md:max-h-full">
      <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural max-w-7xl ">
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
              exercises={exercises}
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