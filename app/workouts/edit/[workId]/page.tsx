"use client"

import ExerciseCard from "@/components/cards/ExerciseCard";
import Modal from "@/components/Modal";
import Button from "@/components/ui/Button";
import { useExercises } from "@/hooks/useExercises";
import { useUser } from "@/hooks/useUser";
import { useWorkoutTemplates } from "@/hooks/workout/useWorkoutTemplates";
import { workoutReducer } from "@/hooks/workout/workoutReducer";
import { workoutService } from "@/services/workout.service";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";

type ModalState =
  | { type: 'ADD' }
  | { type: 'EDIT', exerciseId: string }
  | { type: 'DELETE', exerciseId: string }
  | null;

export default function WorkoutEdit() {
  const {workId} = useParams();
  const workoutId = workId as string;
  const router = useRouter();
  const {user} = useUser();

  const [workout, dispatch] = useReducer(workoutReducer, null as any);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { exercises, createExercise } = useExercises(user?.id ?? "");
  const [search, setSearch] = useState<string>("");
  const [newExerciseType, setNewExerciseType] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      const template = await workoutService.getById(workoutId);

      if (template) {
        dispatch({
          type: "INIT",
          payload: {
            ...template,
            exercises: template.exercises || []
          }
        });
      }

      setIsLoaded(true);
    };

    fetchTemplate();
  }, [workoutId]);

  const handleSaveTemplate = async () => {
    await workoutService.update(workoutId, {
      name: workout.name,
      description: workout.description,
      exercises: workout.exercises
    });

    router.push('/workouts');
  }
  
  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoaded || !workout) {
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
                dispatch({ type: "EDIT_WORKOUT", payload: { name: e.target.value, description: workout.description } })
              }
              className="text-4xl font-bold bg-transparent outline-none"
            />

            <textarea
              value={workout.description}
              onChange={(e) =>
                dispatch({ type: "EDIT_WORKOUT", payload: { name: workout.name, description: e.target.value } })
              }
              className="text-sm text-secondary bg-transparent outline-none resize-none"
            />
          </div>
          
          <Button 
            onClick={() => setModal({ type: 'ADD' })}
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
                mode="edit"
                exercise={exercise}
                setActions={{
                update: (setId, field, value) =>
                  dispatch({ type: "UPDATE_SET", payload: { exerciseInstanceId: exercise.id, setId, field, value } }),
                toggle: (_, setId) =>
                  dispatch({ type: "TOGGLE_SET", payload: { exerciseInstanceId: exercise.id, setId } }),
              }}
              editActions={{
                addSet: () => 
                  dispatch({ type: "ADD_SET", payload: { exerciseInstanceId: exercise.id } }),
                deleteExercise: (exerciseId) => 
                  dispatch({ type: "DELETE_EXERCISE", payload: { exerciseId } }),
                deleteSet: (_, setId) => 
                  dispatch({ type: "DELETE_SET", payload: { exerciseInstanceId: exercise.id, setId } })
              }}
              exercises={exercises}
            />
          )))}
        </section>

        <footer className="w-full py-8 my-6  border-t border-zinc-800">
          <Button 
            onClick={handleSaveTemplate}
            className="uppercase"
          >
            Guardar rutina
          </Button>
        </footer>
        
        {modal?.type === 'ADD' && (
          <Modal onClose={() => setModal(null)}>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Agregar ejercicio</h2>
              <button onClick={() => setModal(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Buscar ejercicio..."
              className="w-full p-3 bg-black/70 rounded-lg mb-4 outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedExercise(null);
              }}
            />

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4">
              
              {filteredExercises.length > 0 ? (
                filteredExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex.id)}
                    className={`text-left p-3 rounded-lg transition 
                      ${selectedExercise === ex.id 
                        ? "bg-primary text-white" 
                        : "bg-black/40 hover:bg-black/60"
                      }
                    `}
                  >
                    <div className="font-semibold">{ex.name}</div>
                    <div className="text-xs text-zinc-400">{ex.type}</div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-zinc-400 text-center py-4">
                  No se encontraron ejercicios
                </div>
              )}

            </div>

            {search && filteredExercises.length === 0 && (
              <div className="flex flex-col gap-3 mb-3">
                
                <select
                  className="p-3 bg-black/70 rounded-lg"
                  value={newExerciseType}
                  onChange={(e) => setNewExerciseType(e.target.value)}
                >
                  <option value="">Tipo de ejercicio</option>
                  <option value="Barra">Barra</option>
                  <option value="Mancuernas">Mancuernas</option>
                  <option value="Máquina">Máquina</option>
                  <option value="Polea">Polea</option>
                  <option value="Otro">Otro</option>
                </select>

                <button
                  disabled={!newExerciseType}
                  className={`w-full p-3 rounded-lg transition
                    ${newExerciseType 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"}
                  `}
                  onClick={async () => {
                    const newEx = await createExercise(search, newExerciseType);

                    if (newEx) {
                      setSelectedExercise(newEx.id);
                    }
                    setNewExerciseType("");
                  }}
                >
                  Crear "{search}"
                </button>

              </div>
            )}

            <button
              disabled={!selectedExercise}
              onClick={() => {
                if (!selectedExercise) return;

                dispatch({
                  type: "ADD_EXERCISE",
                  payload: { exerciseId: selectedExercise }
                });

                setSearch("");
                setSelectedExercise(null);
                setModal(null);
              }}
              className={`w-full py-3 rounded-lg font-semibold transition
                ${selectedExercise 
                  ? "bg-primary/80 hover:bg-primary/90 text-white" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"}
              `}
            >
              Agregar ejercicio
            </button>

          </Modal>
        )}
      </main>
    </div>
  );
}