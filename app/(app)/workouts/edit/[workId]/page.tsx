"use client"

import Button from "@/components/ui/Button";
import ExerciseCard from "@/components/workout/edit/ExcerciseCardEdit";
import ModalCreateExercise from "@/components/workout/edit/ModalCreateExercise";
import { useUser } from "@/contexts/AuthContext";
import { useExercisesQuery } from "@/queries/exercises/getExercisesQuery";
import { useCreateExerciseMutation } from "@/queries/exercises/useCreateExercisesMutation";
import { useWorkoutByIdQuery } from "@/queries/workout/getWorkoutByIdQuery";
import { useUpdateWorkoutMutation } from "@/queries/workout/useUpdateWorkoutMutation";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type ModalState =
  | { type: 'ADD' }
  | { type: 'EDIT', exerciseId: string }
  | { type: 'DELETE', exerciseId: string }
  | null;

export default function WorkoutEdit() {
  const {workId} = useParams();
  const workoutId = workId as string;
  const router = useRouter();
  const {user} = useUser();

  const { workout, isLoaded, initWorkout, editWorkout, addSet, deleteExercise, deleteSet, addExercise } = useWorkoutStore();

  const { data: exercises = [], isLoading: isExercisesLoading } = useExercisesQuery(user?.id ?? "");
  const [search, setSearch] = useState<string>("");
  const [newExerciseType, setNewExerciseType] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const {
    data: template,
    isLoading
  } = useWorkoutByIdQuery(workoutId);

  const createExercise = useCreateExerciseMutation();

  const updateWorkout = useUpdateWorkoutMutation();

  useEffect(() => {
      if (workoutId ) {
        initWorkout(workoutId, template ? [template] : [], []);
      }
    }, [workoutId, template]);

  const handleSaveTemplate = async () => {
    if (!workout) return;

    try {
      await updateWorkout.mutateAsync({
        workoutId,
        workoutData: {
          name: workout.name,
          description: workout.description,
          exercises: workout.exercises
        }
      });
      router.push('/workouts');
    } catch (error) {
      toast.error("Error al guardar la rutina. Intenta nuevamente.");
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateExercise = async () => {
    const newEx = await createExercise.mutateAsync({
      name: search, 
      type: newExerciseType,
      user_id: user?.id ?? ""
    });

    if (newEx) {
      setSelectedExercise(newEx.id);
    }
    setNewExerciseType("");
  }

  if (!isLoaded || !workout || isExercisesLoading ) {
    return <div className="flex items-center justify-center h-screen">Cargando rutina...</div>;
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[90vh] md:max-h-full">
      <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural max-w-7xl ">
        <div className="w-full flex items-center justify-between gap-2">
          
          <p className="uppercase text-sm text-primary leading-5 tracking-widest">Editar Rutina</p>

          <Link href="/workouts" className="ml-auto text-sm text-secondary hover:underline transition-colors">
            <ArrowLeft className="w-4 h-4 inline-block mr-1" />
            Volver a mis rutinas
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full pb-2">
          
          <div className="flex flex-col gap-2 ">
            
            <input
              type="text"
              value={workout.name}
              onChange={(e) =>
                editWorkout(e.target.value, workout.description)
              }
              className="text-4xl font-bold bg-transparent outline-none"
            />

            <textarea
              value={workout.description}
              onChange={(e) =>
                editWorkout(workout.name, e.target.value)
              }
              className="text-sm text-secondary bg-transparent outline-none resize-none"
            />
          </div>
          
          <Button 
            onClick={() => setModal({ type: 'ADD' })}
            className="lg:w-72"
          >
            <Plus className="w-5 h-5" />
            Agregar ejercicio
          </Button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {workout.exercises.length === 0 ? (
            <div className="col-span-full text-center text-secondary">
              No hay ejercicios. ¡Agrega tu primer ejercicio!
            </div>
          ) : (
            workout.exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                editActions={{
                  addSet: () => 
                    addSet(exercise.id),
                  deleteExercise: (exerciseId) => 
                    deleteExercise(exerciseId),
                  deleteSet: (_, setId) => 
                    deleteSet(exercise.id, setId)
                }}
                exercises={exercises}
            />
          )))}
        </section>

        <footer className="sticky bottom-4 md:static w-full py-8 my-6  border-t border-zinc-800">
          <Button 
            onClick={handleSaveTemplate}
            className="uppercase"
          >
            Guardar rutina
          </Button>
        </footer>
        
        {modal?.type === 'ADD' && (
          <ModalCreateExercise
            filteredExercises={filteredExercises}
            search={search}
            newExerciseType={newExerciseType}
            selectedExercise={selectedExercise}
            setSearch={setSearch}
            setNewExerciseType={setNewExerciseType}
            setSelectedExercise={setSelectedExercise}
            handleCreateExercise={handleCreateExercise}
            addExercise={(exerciseId) => {
              addExercise(exerciseId);
              setModal(null);
            }}
            setModal={setModal}
          />
        )}
      </main>
    </div>
  );
}