"use client"

import { Card } from "@/components/cards/Card";
import { WorkoutCard } from "@/components/cards/WorkutCard";
import { CustomSelect } from "@/components/CustomSelect";
import Modal from "@/components/Modal";
import { useRoutines } from "@/hooks/useRoutine";
import { useUser } from "@/hooks/useUser";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkoutPage() {
    const {user} = useUser();
    const router = useRouter();
    const {
        templates,
        createTemplate,
        deleteTemplate,
        isLoaded
    } = useWorkoutTemplates(user?.id ?? "");

    const { routine, createRoutine, updateRoutine } = useRoutines(user?.id ?? "", );

    const [openModal, setOpenModal] = useState(false);
    const [openModalPlan, setOpenModalPlan] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [plan, setPlan] = useState<Record<number, string | null>>({});

    if (!isLoaded) return null;

    const handleCreate = async () => {
        const newId = await createTemplate();

        if (!newId) return;

        router.push(`/workouts/edit/${newId}`);
    };

    const handleModalDelete = (id: string) => {
        setSelectedId(id);
        setSelectedName(templates.find(t => t.id === id)?.name || null);
        setOpenModal(true);
    }

    const handlePlan = () => {
        if (routine?.days && routine.days.length > 0) {
            const initialPlan: Record<number, string> = {};

            routine.days.forEach(d => {
                initialPlan[d.day] = d.templateId;
            });

            setPlan(initialPlan);
        }

        setOpenModalPlan(true);
    };

    const days = [
        { label: "Domingo", value: 0 },
        { label: "Lunes", value: 1 },
        { label: "Martes", value: 2 },
        { label: "Miércoles", value: 3 },
        { label: "Jueves", value: 4 },
        { label: "Viernes", value: 5 },
        { label: "Sábado", value: 6 },
    ];

    const handleSaveRoutine = () => {
        const days = Object.entries(plan)
            .filter(([_, templateId]) => templateId)
            .map(([day, templateId]) => ({
                day: Number(day),
                templateId: templateId as string
            }));

        if (routine) {
            updateRoutine({
                ...routine,
                days
            });
        } else {
            createRoutine(days);
        }

        setOpenModalPlan(false);
    };

    const templatesForPlan = [...templates, { id: "", name: "Descanso" }];


    if(!user) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-natural ">
                <main className="flex flex-1 w-full flex-col gap-2 items-center p-4 bg-white dark:bg-natural max-w-7xl">
                    <h1 className="text-4xl font-bold">Inicia sesión para ver tus rutinas</h1>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-natural ">
            <main className="flex flex-1 w-full flex-col gap-2 items-start p-4 bg-white dark:bg-natural max-w-7xl overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
                <p className="uppercase text-sm text-secondary leading-5 tracking-widest">Arma tu rutina - Selecciona para editar</p>
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

                    <Card className="w-full flex gap-4 items-center justify-center bg-secondary! cursor-pointer hover:bg-secondary/80! transition-colors" onClick={handlePlan}>
                        <p className="text-lg text-zinc-300 font-semibold">
                            Planificar rutina
                        </p>
                    </Card>
                </div>

                {selectedId && openModal && (
                    <Modal
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedId(null);
                        }}
                        className="max-w-xl"
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

                {openModalPlan && (
                    <Modal
                        onClose={() => {
                            setOpenModalPlan(false);
                        }}
                        className="max-w-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between w-full">                                
                                <h2 className="text-xl font-semibold">Planificar semana</h2>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setOpenModalPlan(false);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 py-6 w-full">
                            {days.map((day, index) => (
                                <div key={index} className="flex items-center gap-4 w-full justify-between">
                                    <p className="min-w-32">{day.label}</p>
                                    <CustomSelect
                                        options={templatesForPlan.map(t => ({ 
                                            id: t.id, 
                                            name: t.name 
                                        }))}
                                        value={plan[index] || ""}
                                        onChange={(value) => {
                                            setPlan(prev => ({
                                                ...prev,
                                                [index]: value || null
                                            }));
                                        }}
                                        defaultValue="Seleccionar rutina"
                                    />

                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 w-full ">
                            <button
                                className="p-4 font-semibold bg-primary/60 text-white rounded hover:bg-secondary transition-colors cursor-pointer w-full"
                                onClick={handleSaveRoutine}
                            >
                                Guardar rutina
                            </button>
                        </div>

                    </Modal>
                )}
            </main>
        </div>
    );
}