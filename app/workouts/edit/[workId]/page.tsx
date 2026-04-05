"use client"

import { Card } from "@/components/cards/Card";
import ExerciseCard from "@/components/cards/ExerciseCard";
import Modal from "@/components/Modal";
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

  if (!workoutId) {
    return <div className="flex items-center justify-center h-screen">ID de rutina no proporcionado.</div>;
  }

  const {
    workout,
    dispatch,
    saveTemplate,
    isLoaded
  } = useWorkoutTemplate(workoutId);

  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState({ name: '', type: '' });
  const [workoutForm, setWorkoutForm] = useState({
    name: workout.name,
    description: workout.description
  });

  useEffect(() => {
    setWorkoutForm({
      name: workout.name,
      description: workout.description
    });
  }, [workout]);
 
  const handleOpenEdit = (exerciseId: string) => {
    const ex = workout.exercises.find(e => e.id === exerciseId);
    if (!ex) return;

    setForm({
      name: ex.name,
      type: ex.type,
    });

    setModal({ type: "EDIT", exerciseId });
  };

  const resetForm = () => setForm({ name: "", type: "" });

  const handleSaveTemplate = () => {
    saveTemplate({
      name: workoutForm.name,
      description: workoutForm.description
    });
    router.push('/workouts');
  }
  
  if (!isLoaded ) return null; // o loader
  
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
      <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural overflow-y-auto max-h-[85vh]">
        <p className="uppercase text-sm text-primary leading-5">Editar Rutina</p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full pb-2">
          
          <div className="flex flex-col gap-2 ">
            
            <input
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
                  dispatch({ type: "UPDATE_SET", payload: { exerciseId: exercise.id, setId, field, value } }),
                toggle: (exerciseId, setId) =>
                  dispatch({ type: "TOGGLE_SET", payload: { exerciseId, setId } }),
              }}
              editActions={{
                addSet: (exerciseId) => 
                  dispatch({ type: "ADD_SET", payload: { exerciseId } }),
                editExercise: (exerciseId) => 
                  handleOpenEdit(exerciseId),
                deleteExercise: (exerciseId) => 
                  dispatch({ type: "DELETE_EXERCISE", payload: { exerciseId } }),
                deleteSet: (exerciseId, setId) => 
                  dispatch({ type: "DELETE_SET", payload: { exerciseId, setId } })
              }}
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
              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold">Agregar nuevo ejercicio</h2>
                <button
                  className="  text-white p-2 rounded-full hover:bg-red-500 cursor-pointer transition-colors duration-200"
                  onClick={() => setModal(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-6 py-4">
                <input 
                  type="text" 
                  placeholder="Nombre del ejercicio" 
                  className="p-2 py-3 bg-black/70 rounded-lg" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />

                <select 
                  name="exerciseType" 
                  id="exerciseType" 
                  className="p-2 py-3 bg-black/70 rounded-lg"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                >
                  <option value="">Tipo de ejercicio</option>
                  <option value="Barra">Barra</option>
                  <option value="Mancuernas">Mancuernas</option>
                  <option value="Maquina">Máquina</option>
                  <option value="Polea">Polea</option>
                </select>
              </div>

              <button
                className="w-full bg-primary/80 text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold cursor-pointer"
                onClick={() => {
                  dispatch({ type: "ADD_EXERCISE", payload: { name: form.name, type: form.type } });
                  resetForm();
                  setModal(null);
                }}
              >
                Agregar ejercicio
              </button>
          </Modal>
        )}

        {modal?.type === 'EDIT' && (
          <Modal onClose={() => setModal(null)}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Editar ejercicio</h2>
            </div>
            <div className="flex flex-col gap-6 py-4">
              <input 
                type="text" 
                placeholder="Nombre del ejercicio" 
                className="p-2 py-3 bg-black/70 rounded-lg" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
              <select 
                name="exerciseType" 
                id="exerciseType" 
                className="p-2 py-3 bg-black/70 rounded-lg"
                value={form.type}
                onChange={(e) => setForm({...form, type: e.target.value})}
              >
                <option value="">Tipo de ejercicio</option>
                <option value="Barra">Barra</option>
                <option value="Mancuernas">Mancuernas</option>
                <option value="Maquina">Máquina</option>
                <option value="Polea">Polea</option>
              </select>
            </div>
            <button
              className="w-full bg-primary/80 text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold cursor-pointer"
              onClick={() => {
                dispatch({ type: "EDIT_EXERCISE", payload: { exerciseId: modal.exerciseId, name: form.name, type: form.type } });
                resetForm();
                setModal(null);
              }}
            >
              Editar ejercicio
            </button>
          </Modal>
        )}
      </main>
    </div>
  );
}