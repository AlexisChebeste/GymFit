"use client"

import Button from "@/components/ui/Button";
import HeaderSession from "@/components/workout/HeaderSession";
import ExerciseCard from "@/components/workout/session/ExcerciseCardSession";
import { useUser } from "@/contexts/AuthContext";
import { getExercisePerformanceMap } from "@/lib/performance/performance.selectors";
import { useExercisesQuery } from "@/queries/exercises/getExercisesQuery";
import { useWorkoutPerformanceQuery } from "@/queries/performance/useWorkoutPerformanceQuery";
import { useCreateSessionMutation } from "@/queries/sessions/useCreateSessionMutation";
import { useWorkoutsQuery } from "@/queries/workout/getWorkoutsQuery";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function WorkoutSession() {
  const {workId} = useParams();
  const {user} = useUser();
  const workoutId = workId as string;
  const router = useRouter();

  const { workout, initWorkout, updateSet, toggleSet, clearSession, incrementElapsedSeconds, elapsedSeconds } = useWorkoutStore();

  const { data: performanceSessions = [] , isLoading: isPerformanceLoading } =
    useWorkoutPerformanceQuery(
      user?.id,
      workoutId
    );
  const { data: exercises = [], isLoading: isExercisesLoading } = useExercisesQuery(user?.id ?? "");
  const { data: templates = [], isLoading: isTemplatesLoading } = useWorkoutsQuery(user?.id ?? "");

  const performanceMap = useMemo(
    () =>
      getExercisePerformanceMap(
        performanceSessions
      ),
    [performanceSessions]
  );
  
  const exercisesMap = useMemo(() => {
    return new Map(
      exercises.map(ex => [ex.id, ex])
    );
  }, [exercises]);

  useEffect(() => {
    if (!workoutId) return;
    if (templates.length === 0) return;

    initWorkout(
      workoutId,
      templates,
      performanceSessions
    );

  }, [
    workoutId,
    templates,
    performanceSessions,
    initWorkout
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      incrementElapsedSeconds();
    }, 1000);

    return () => clearInterval(interval);
  }, [incrementElapsedSeconds]);
  
  const createSession = useCreateSessionMutation();

  if (isPerformanceLoading || !workout || isExercisesLoading || isTemplatesLoading) return <div className="flex items-center justify-center h-screen">Cargando sesión...</div>;

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
        <HeaderSession name={workout.name} description={workout.description} seconds={elapsedSeconds} />

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {workout.exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              exerciseId={ex.id}
              performance={performanceMap.get(ex.exercise_id) ?? undefined}
              exerciseData={exercisesMap.get(ex.exercise_id)}
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
        
      </main>
    </div>
  );
}