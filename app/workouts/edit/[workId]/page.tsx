"use client"

import { Card } from "@/components/cards/Card";
import ExerciseCard from "@/components/cards/ExerciseCard";
import Modal from "@/components/Modal";
import { useExercises } from "@/hooks/useExercises";
import { useUser } from "@/hooks/useUser";
import { useWorkoutTemplate } from "@/hooks/useWorkoutTemplate";
import { Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ModalState =
  | { type: 'ADD' }
  | { type: 'EDIT', exerciseId: string }
  | { type: 'DELETE', exerciseId: string }
  | null;

export default function WorkoutEdit() {
  const params = useParams();
  const workoutId = params.workId as string;
  const router = useRouter();
  const {user} = useUser();

  if (!workoutId) {
    return <div className="flex items-center justify-center h-screen">ID de rutina no proporcionado.</div>;
  }

  const {
    workout,
    dispatch,
    saveTemplate,
    isLoaded
  } = useWorkoutTemplate(workoutId);

  const { exercises, createExercise } = useExercises(user?.id ?? "");
  const [search, setSearch] = useState("");
  const [newExerciseType, setNewExerciseType] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const [modal, setModal] = useState<ModalState>(null);
  const [workoutForm, setWorkoutForm] = useState({
    name: "Rutin",
    description: "Una descripción breve de mi rutina"
  });

  useEffect(() => {
    if (!workout) return;

    setWorkoutForm({
      name: workout.name || "",
      description: workout.description || ""
    });
  }, [workout]);

  const handleSaveTemplate = async () => {
    await saveTemplate({
      name: workoutForm.name,
      description: workoutForm.description
    });
    router.push('/workouts');
  }
  
  if (!isLoaded ) return null; // o loader
  
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural overflow-y-auto max-h-[90vh] md:max-h-full">
      <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural max-w-7xl ">
        <p className="uppercase text-sm text-primary leading-5 tracking-widest">Editar Rutina</p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full pb-2">
          
          <div className="flex flex-col gap-2 ">
            
            <input
              type="text"
              value={workoutForm.name}
              onChange={(e) =>
                setWorkoutForm(prev => ({ ...prev, name: e.target.value }))
              }
              className="text-4xl font-bold bg-transparent outline-none"
            />

            <textarea
              value={workoutForm.description}
              onChange={(e) =>
                setWorkoutForm(prev => ({ ...prev, description: e.target.value }))
              }
              className="text-sm text-secondary bg-transparent outline-none resize-none"
            />
          </div>
          
          <Card 
            className="flex items-center justify-center gap-2 border-2  bg-green-500! shadow-lg cursor-pointer p-4! text-white hover:bg-green-600! transition-colors text-sm font-semibold "
            onClick={() => setModal({ type: 'ADD' })}
          >
            <Plus className="w-5 h-5" />
            Agregar ejercicio
          </Card>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {workout.exercises.length === 0 ? (
            <div className="col-span-full text-center text-secondary">
              No hay ejercicios agregados. ¡Agrega tu primer ejercicio!
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
                toggle: (exerciseInstanceId, setId) =>
                  dispatch({ type: "TOGGLE_SET", payload: { exerciseInstanceId: exercise.id, setId } }),
              }}
              editActions={{
                addSet: (exerciseId) => 
                  dispatch({ type: "ADD_SET", payload: { exerciseInstanceId: exercise.id } }),
                deleteExercise: (exerciseId) => 
                  dispatch({ type: "DELETE_EXERCISE", payload: { exerciseId } }),
                deleteSet: (exerciseId, setId) => 
                  dispatch({ type: "DELETE_SET", payload: { exerciseInstanceId: exercise.id, setId } })
              }}
              exercises={exercises}
            />
          )))}
        </section>

        <footer className="w-full py-8 mt-4 border-t border-zinc-800">
          <button 
            className="w-full bg-primary/90 text-natural hover:bg-primary/80  font-black py-4 rounded-2xl shadow-neon-glow transition-transform active:scale-95 cursor-pointer uppercase"
            onClick={handleSaveTemplate}
          >
            Guardar rutina
          </button>
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