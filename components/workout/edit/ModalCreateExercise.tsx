import { ModalState } from "@/app/(app)/workouts/edit/[workId]/page";
import Modal from "@/components/Modal";
import { Exercise } from "@/types/types";
import { X } from "lucide-react";

interface ModalCreateExerciseProps {
    search: string;
    newExerciseType: string;
    selectedExercise: string | null;
    filteredExercises: Exercise[];
    setSearch: (value: string) => void;
    setNewExerciseType: (value: string) => void;
    setSelectedExercise: (value: string | null) => void;
    handleCreateExercise: () => void;
    addExercise: (exerciseId: string) => void;
    setModal: (value: ModalState) => void;
}

export default function ModalCreateExercise({ filteredExercises, search, newExerciseType, selectedExercise, setSearch, setNewExerciseType, setSelectedExercise, handleCreateExercise, addExercise, setModal }: ModalCreateExerciseProps) {
  return (
          <Modal onClose={() => setModal(null)}>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Agregar ejercicio</h2>
              <button onClick={() => setModal(null)} className="
                text-zinc-400 hover:text-zinc-600 transition-colors
                cursor-pointer
              ">
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
                  onClick={handleCreateExercise}
                >
                  Crear "{search}"
                </button>

              </div>
            )}

            <button
              disabled={!selectedExercise}
              onClick={() => {
                if (!selectedExercise) return;

                addExercise(selectedExercise);

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
  )
}