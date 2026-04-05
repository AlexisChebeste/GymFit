"use client"

import { Card } from "@/components/cards/Card";
import { WorkoutCard } from "@/components/cards/WorkutCard";
import Modal from "@/components/Modal";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkoutPage() {
    const router = useRouter();
    const {
        templates,
        createTemplate,
        deleteTemplate,
        isLoaded
    } = useWorkoutTemplates();

    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);

    if (!isLoaded) return null;

    const handleCreate = () => {
        const newId = createTemplate();

        router.push(`/workouts/edit/${newId}`);
    };

    const handleModalDelete = (id: string) => {
        setSelectedId(id);
        setSelectedName(templates.find(t => t.id === id)?.name || null);
        setOpenModal(true);
    }


    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
            <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural overflow-y-auto max-h-[85vh]">
                <p className="uppercase text-sm text-secondary leading-5">Arma tu rutina - Selecciona para editar</p>
                <h1 className="text-4xl font-bold">Mi Rutina</h1>

                <div className="flex flex-col gap-4 items-center w-full py-4 ">
                    {templates.map((workout) => (
                        <WorkoutCard 
                            key={workout.id} 
                            workout={workout} 
                            deleteTemplate={handleModalDelete} 
                        />
                    ))}
                    <Card className="w-full flex gap-4 items-center justify-center border-dashed border-2 border-stone-300 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={handleCreate}>
                        <Plus className="w-6 h-6 text-stone-600" />
                        <p className="text-lg text-stone-600">
                            Agregar rutina
                        </p>
                    </Card>
                </div>

                {selectedId && openModal && (
                    <Modal
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedId(null);
                        }}
                    >
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">¿Estas seguro de eliminar la rutina <span className="font-bold text-red-600">{selectedName}</span>?</h2>
                            <p className="text-sm text-secondary">Esta acción no se puede deshacer.</p>
                            <div className="flex gap-4 w-full justify-end">
                                <button 
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                                    onClick={() => {
                                        deleteTemplate(selectedId);
                                        setOpenModal(false);
                                        setSelectedId(null);
                                    }}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setOpenModal(false);
                                        setSelectedId(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
}