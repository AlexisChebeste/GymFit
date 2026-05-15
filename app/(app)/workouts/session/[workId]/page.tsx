"use client"

import Button from "@/components/ui/Button";
import HeaderSession from "@/components/workout/HeaderSession";
import ExerciseCard from "@/components/workout/session/ExcerciseCardSession";
import Timer from "@/components/workout/Timer";
import { useUser } from "@/contexts/AuthContext";
import { useExercisesQuery } from "@/queries/exercises/getExercisesQuery";
import { useSessionsQuery } from "@/queries/sessions/getSessionsQuery";
import { useCreateSessionMutation } from "@/queries/sessions/useCreateSessionMutation";
import { useWorkoutsQuery } from "@/queries/workout/getWorkoutsQuery";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import type { WorkoutSession } from "@/types/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WorkoutSession() {
  const {workId} = useParams();
  const {user} = useUser();
  const workoutId = workId as string;
  const router = useRouter();
  const [openTimer, setOpenTimer] = useState<boolean>(false);

  const { workout, isLoaded, initWorkout, updateSet, toggleSet, clearSession} = useWorkoutStore();

  const { data: sessions = [], isLoading } = useSessionsQuery(user?.id ?? "");
  const { data: exercises = [], isLoading: isExercisesLoading } = useExercisesQuery(user?.id ?? "");
  const { data: templates = [], isLoading: isTemplatesLoading } = useWorkoutsQuery(user?.id ?? "");

  useEffect(() => {
      if (workoutId && templates.length > 0) {
        initWorkout(workoutId, templates, sessions);
      }
    }, [workoutId, templates.length]);
  
  const createSession = useCreateSessionMutation();

  if (isLoading || !isLoaded || isExercisesLoading || isTemplatesLoading) return <div className="flex items-center justify-center h-screen">Cargando sesión...</div>;

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

  const handleFinishSession = async () => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const payload = {
      workout_id: workout.id,
      user_id: user.id,
      date: today,
      exercises: workout.exercises.map(ex => ({
        exercise_id: ex.exercise_id,
        sets: ex.sets.map(s => ({
          weight: s.weight,
          reps: s.reps,
          rir: s.rir,
        }))
      }))
    };

    try {

      await createSession.mutateAsync(payload);

      clearSession(); 

      toast.success("Sesión guardada exitosamente");

      router.push("/workouts");

    } catch (err) {
      toast.error("Error al guardar la sesión.");
    }
  };
  
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[90vh] md:max-h-full">
      <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural max-w-7xl ">
        <HeaderSession name={workout.name} description={workout.description} />

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {workout.exercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              setActions={{
                update: (setId, field, value) =>
                  updateSet(exercise.id, setId, field, value),
                toggle: (exerciseInstanceId, setId) =>
                  toggleSet(exerciseInstanceId, setId),
              }}
              sessions={sessions}
              exercises={exercises}
              setOpenTimer={setOpenTimer}
            />
          ))}
        </section>


        <footer className="w-full py-8 my-6  border-t border-zinc-800">
          <Button 
            onClick={handleFinishSession}
            className="uppercase"
          >
            Finalizar y Guardar Sesión
          </Button>
        </footer>

        {openTimer && (
          <Timer onClose={() => setOpenTimer(false)}/>
        )}
      </main>
    </div>
  );
}